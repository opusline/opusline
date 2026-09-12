<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseVatStatus;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    freezeTodayAtUtcNoon();
    Storage::fake('local');
});

test('defers a selection to the next CA3 and answers with the month it was listed in', function (): void {
    $user = vatLiableUser();
    $first = receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(12_000));
    $second = receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-09')->ttc(6_000));

    $this->actingAs($user)
        ->postJson('/api/expenses/vat-deferrals', ['expenseIds' => [$first->id, $second->id]])
        ->assertOk()
        ->assertJsonPath('month', '2026-08')
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::Deferred->value)
        ->assertJsonPath('expenses.0.vatClaimPeriod', '2026-09')
        ->assertJsonPath('expenses.0.isRegularisation', false)
        ->assertJsonPath('vat.deductible.amount', 0)
        ->assertJsonPath('vat.deferred.amount', 3_000);

    $this->actingAs($user)
        ->getJson('/api/expenses?month=2026-09')
        ->assertOk()
        ->assertJsonCount(0, 'expenses')
        ->assertJsonPath('vat.deductible.amount', 3_000);
});

test('a deferral skips months already declared', function (): void {
    $user = vatLiableUser();
    $expense = receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-06-05'));
    ca3DeclaredFor($user, '2026-07');

    $this->actingAs($user)
        ->postJson('/api/expenses/vat-deferrals', ['expenseIds' => [$expense->id]])
        ->assertOk()
        ->assertJsonPath('expenses.0.vatClaimPeriod', '2026-08');
});

test('reintegrates a deferred deduction into its own month', function (): void {
    $user = vatLiableUser();
    $expense = receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(12_000));
    $this->actingAs($user)->postJson('/api/expenses/vat-deferrals', ['expenseIds' => [$expense->id]])->assertOk();

    $this->actingAs($user)
        ->deleteJson("/api/expenses/{$expense->id}/vat-deferral")
        ->assertOk()
        ->assertJsonPath('month', '2026-08')
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::Deductible->value)
        ->assertJsonPath('expenses.0.vatClaimPeriod', '2026-08')
        ->assertJsonPath('vat.deductible.amount', 2_000);
});

test('refuses to move a deduction already filed on a declared CA3', function (): void {
    $user = vatLiableUser();
    $expense = receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-05'));
    ca3DeclaredFor($user, '2026-07');

    $this->actingAs($user)->postJson('/api/expenses/vat-deferrals', ['expenseIds' => [$expense->id]])->assertConflict();
    $this->actingAs($user)->deleteJson("/api/expenses/{$expense->id}/vat-deferral")->assertConflict();

    $this->assertDatabaseHas('expenses', ['id' => $expense->id, 'vat_claim_period' => '2026-07']);
});

test('refuses to defer a purchase that carries no deductible TVA', function (): void {
    $user = vatLiableUser();
    $expense = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->reverseCharged(4_800));

    $this->actingAs($user)
        ->postJson('/api/expenses/vat-deferrals', ['expenseIds' => [$expense->id]])
        ->assertConflict();
});

test('refuses a selection holding another account expense', function (): void {
    $foreign = expenseOwnedBy(User::factory()->create());

    $this->actingAs(User::factory()->create())
        ->postJson('/api/expenses/vat-deferrals', ['expenseIds' => [$foreign->id]])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('expenseIds');

    $this->assertDatabaseHas('expenses', ['id' => $foreign->id, 'vat_claim_period' => $foreign->month()]);
});

test('refuses an empty selection', function (): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/expenses/vat-deferrals', ['expenseIds' => []])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('expenseIds');
});
