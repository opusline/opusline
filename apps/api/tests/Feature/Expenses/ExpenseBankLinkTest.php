<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('ties a purchase to the debit that paid it and both sides show it', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(2_880));
    $debit = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(2_880)->on('2026-08-06')->state(['label' => 'PRLV SEPA NORDLYS CLOUD']));

    $this->actingAs($user)
        ->postJson("/api/expenses/{$expense->id}/bank-movement", ['bankMovementId' => $debit->id])
        ->assertCreated()
        ->assertJsonPath('expenses.0.bankMovement.id', $debit->id)
        ->assertJsonPath('expenses.0.bankMovement.bookedOn', '2026-08-06')
        ->assertJsonPath('expenses.0.bankMovement.label', 'PRLV SEPA NORDLYS CLOUD');

    $this->actingAs($user)
        ->getJson('/api/bank/movements')
        ->assertOk()
        ->assertJsonPath('movements.0.expense.id', $expense->id)
        ->assertJsonPath('movements.0.expense.supplier', $expense->supplier);
});

test('unlinking frees the debit and the journal shows none', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user);
    $debit = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit()->state(['expense_id' => $expense->id]));

    $this->actingAs($user)
        ->deleteJson("/api/expenses/{$expense->id}/bank-movement")
        ->assertOk()
        ->assertJsonPath('expenses.0.bankMovement', null);

    expect($debit->fresh()?->expense_id)->toBeNull();
});

test('refuses a debit that is not the account own, a credit, or one already explained', function (callable $arrange, int $status): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05'));
    $movementId = $arrange($user);

    $this->actingAs($user)
        ->postJson("/api/expenses/{$expense->id}/bank-movement", ['bankMovementId' => $movementId])
        ->assertStatus($status);
})->with([
    'another account debit' => [fn (User $user): int => bankMovementFor(User::factory()->create(), configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit())->id, 422],
    'a credit' => [fn (User $user): int => bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit())->id, 422],
    'a debit paying another expense' => [function (User $user): int {
        $other = expenseOwnedBy($user);

        return bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit()->state(['expense_id' => $other->id]))->id;
    }, 409],
]);

test('linking a purchase again moves the link to the new debit', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user);
    $first = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit()->state(['expense_id' => $expense->id]));
    $second = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit());

    $this->actingAs($user)
        ->postJson("/api/expenses/{$expense->id}/bank-movement", ['bankMovementId' => $second->id])
        ->assertCreated();

    expect($first->fresh()?->expense_id)->toBeNull()
        ->and($second->fresh()?->expense_id)->toBe($expense->id);
});

test('deleting a linked purchase frees its debit', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user);
    $debit = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit()->state(['expense_id' => $expense->id]));

    $this->actingAs($user)->deleteJson("/api/expenses/{$expense->id}")->assertNoContent();

    expect($debit->fresh()?->expense_id)->toBeNull();
});
