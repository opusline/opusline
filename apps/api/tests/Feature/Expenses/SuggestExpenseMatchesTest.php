<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Expenses\Actions\SuggestExpenseMatches;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Expenses\Factories\SubscriptionFactory;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('links a debit to the purchase whose supplier it names, at the exact amount within five days', function (): void {
    $user = User::factory()->create();
    $expense = expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(2_880)->state(['supplier' => 'Nordlys Cloud']));
    $debit = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(2_880)->on('2026-08-09')->state(['label' => 'CARTE 08/08 NORDLYS CLOUD SAS']));
    $tooFar = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(2_880)->on('2026-08-20')->state(['label' => 'CARTE NORDLYS CLOUD SAS']));

    expect(app(SuggestExpenseMatches::class)->handle($user))->toBe(1)
        ->and($debit->fresh()?->expense_id)->toBe($expense->id)
        ->and($tooFar->fresh()?->expense_id)->toBeNull();
});

test('a subscription debit is paired on amount and date alone when its supplier is too short to look for', function (): void {
    $user = User::factory()->create();
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->named('Nyx', ExpenseCategory::Software)->monthly(5)->startedOn('2026-08-05')->recordedOn('2026-08-01'));
    $debit = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(2_880)->on('2026-08-05')->state(['label' => 'PRLV SEPA 000123']));

    // Reading the journal writes the August debit and pairs it on the spot.
    $this->actingAs($user)->getJson('/api/expenses')->assertOk()
        ->assertJsonPath('expenses.0.bankMovement.id', $debit->id);
});

test('two purchases that both answer leave the debit alone', function (): void {
    $user = User::factory()->create();
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(2_880)->state(['supplier' => 'Nordlys Cloud']));
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-06')->ttc(2_880)->state(['supplier' => 'Nordlys Cloud']));
    $debit = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(2_880)->on('2026-08-07')->state(['label' => 'NORDLYS CLOUD']));

    expect(app(SuggestExpenseMatches::class)->handle($user))->toBe(0)
        ->and($debit->fresh()?->expense_id)->toBeNull();
});

test('an unnamed purchase at the right amount is not enough', function (): void {
    $user = User::factory()->create();
    expenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-08-05')->ttc(2_880)->state(['supplier' => 'Lunaprint']));
    $debit = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(2_880)->on('2026-08-05')->state(['label' => 'CARTE 05/08 CB*1234']));

    expect(app(SuggestExpenseMatches::class)->handle($user))->toBe(0)
        ->and($debit->fresh()?->expense_id)->toBeNull();
});

test('the journal flags a subscription-looking debit no expense explains', function (): void {
    $user = User::factory()->create();
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->named('Nordlys Cloud', ExpenseCategory::Hosting)->state(['auto_create_expenses' => false]));
    $debit = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(2_880)->on('2026-08-05')->state(['label' => 'PRLV NORDLYS CLOUD']));
    bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(9_900)->on('2026-08-06')->state(['label' => 'CARTE BOULANGERIE']));

    $this->actingAs($user)->getJson('/api/expenses?month=2026-08')->assertOk()
        ->assertJsonCount(1, 'todo')
        ->assertJsonPath('todo.0.kind', 1)
        ->assertJsonPath('todo.0.bankMovementId', $debit->id)
        ->assertJsonPath('todo.0.label', 'PRLV NORDLYS CLOUD')
        ->assertJsonPath('todo.0.amount.amount', 2_880)
        ->assertJsonPath('todo.0.date', '2026-08-05');
});
