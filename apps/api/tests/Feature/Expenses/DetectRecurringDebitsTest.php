<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Factories\SubscriptionFactory;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * @param  list<string>  $dates
 */
function debitsOn(User $user, array $dates, int $cents = 1_499, string $label = 'PRLV SEPA STREAMFLOW MEDIA'): void
{
    foreach ($dates as $date) {
        bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit($cents)->on($date)->state(['label' => $label]));
    }
}

test('flags a debit seen three months running, with the day it usually lands on', function (): void {
    $user = User::factory()->create();
    debitsOn($user, ['2026-06-12', '2026-07-14', '2026-08-12']);

    $this->actingAs($user)->getJson('/api/subscriptions')->assertOk()
        ->assertJsonCount(1, 'detected')
        ->assertJsonPath('detected.0.label', 'PRLV SEPA STREAMFLOW MEDIA')
        ->assertJsonPath('detected.0.amount.amount', 1_499)
        ->assertJsonPath('detected.0.debitDay', 12)
        ->assertJsonPath('detected.0.months', ['2026-06', '2026-07', '2026-08'])
        ->assertJsonPath('detected.0.lastBookedOn', '2026-08-12');
});

test('stays quiet for what is not a recurring, unexplained debit', function (callable $arrange): void {
    $user = User::factory()->create();
    $arrange($user);

    $this->actingAs($user)->getJson('/api/subscriptions')->assertOk()->assertJsonPath('detected', []);
})->with([
    'two months only' => [fn (User $user) => debitsOn($user, ['2026-07-12', '2026-08-12'])],
    'a run that stopped' => [fn (User $user) => debitsOn($user, ['2026-05-12', '2026-06-12'])],
    'a gap in the run' => [fn (User $user) => debitsOn($user, ['2026-05-12', '2026-06-12', '2026-08-12'])],
    'the fisc' => [fn (User $user) => debitsOn($user, ['2026-06-05', '2026-07-05', '2026-08-05'], 41_580, 'PRLV URSSAF')],
    'a subscription already recorded' => [function (User $user): void {
        subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->named('Streamflow Media', ExpenseCategory::Software));
        debitsOn($user, ['2026-06-12', '2026-07-12', '2026-08-12']);
    }],
]);

test('dismissing a debit silences its fingerprint', function (): void {
    $user = User::factory()->create();
    debitsOn($user, ['2026-06-12', '2026-07-14', '2026-08-12']);

    $this->actingAs($user)
        ->postJson('/api/subscriptions/detected-debits/dismissals', ['label' => 'PRLV SEPA STREAMFLOW MEDIA', 'amount' => ['amount' => 1_499, 'currency' => 'EUR']])
        ->assertCreated()
        ->assertJsonPath('detected', []);

    $this->assertDatabaseHas('recurring_debit_dismissals', ['user_id' => $user->id, 'label_key' => 'PRLVSEPASTREAMFLOWMEDIA', 'amount_cents' => 1_499]);
});
