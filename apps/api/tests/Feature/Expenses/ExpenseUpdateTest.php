<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Users\Models\User;
use Illuminate\Testing\TestResponse;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * @param  array<string, mixed>  $overrides
 */
function updateExpense(User $user, Expense $expense, array $overrides = []): TestResponse
{
    return test()->actingAs($user)->putJson("/api/expenses/{$expense->id}", [
        'supplier' => 'Lignes du Nord',
        'spentOn' => '2026-07-16',
        'category' => ExpenseCategory::Travel->value,
        'amountTtc' => ['amount' => 8_900, 'currency' => 'EUR'],
        'vatTreatment' => ExpenseVatTreatment::Domestic->value,
        'vatRateBp' => 1_000,
        'proShareBp' => 10_000,
        'description' => 'Paris → Lyon',
        ...$overrides,
    ]);
}

test('replaces every field and answers with the month the expense moved to', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-10'));

    updateExpense($user, $expense)
        ->assertOk()
        ->assertJsonPath('month', '2026-07')
        ->assertJsonPath('expenses.0.id', $expense->id)
        ->assertJsonPath('expenses.0.supplier', 'Lignes du Nord')
        ->assertJsonPath('expenses.0.amountHt.amount', 8_091)
        ->assertJsonPath('expenses.0.vat.amount', 809)
        ->assertJsonPath('expenses.0.category', ExpenseCategory::Travel->value);

    $this->assertDatabaseHas('expenses', [
        'id' => $expense->id,
        'spent_on' => '2026-07-16',
        'amount_ttc_cents' => 8_900,
        'amount_ht_cents' => 8_091,
        'vat_rate_bp' => 1_000,
    ]);
});

test('validates the replacement like a creation', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user);

    updateExpense($user, $expense, ['vatTreatment' => ExpenseVatTreatment::Exempt->value, 'vatRateBp' => 2_000])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('vatRateBp');
});

test('another account expense is invisible and untouched', function (): void {
    $expense = expenseOwnedBy(User::factory()->create());

    updateExpense(User::factory()->create(), $expense)->assertNotFound();

    $this->assertDatabaseHas('expenses', ['id' => $expense->id, 'supplier' => 'Tessaline Télécom']);
});
