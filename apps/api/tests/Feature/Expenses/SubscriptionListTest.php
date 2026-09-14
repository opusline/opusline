<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Factories\SubscriptionFactory;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** The canvas cast: a monthly host, a quarterly insurer, a provisioned annual licence, a paused line and a cancelled one. */
function subscribedAccount(): User
{
    $user = User::factory()->create();
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory
        ->named('Nordlys Cloud', ExpenseCategory::Hosting)->monthly(5)->startedOn('2026-01-05'));
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory
        ->named('Orvella Assurances', ExpenseCategory::Insurance)->exempt()->quarterly(20)->startedOn('2026-02-20')->priced(9_000));
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory
        ->named('Kestrel Devtools', ExpenseCategory::Software)->state(['pro_share_bp' => 5_000])
        ->reverseCharged()->annual(1, 9)->startedOn('2025-09-01')->priced(48_000)->provisioned());
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory
        ->named('Callisto Télécom', ExpenseCategory::Phone)->monthly(12)->paused());
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory
        ->named('Aster Télécom', ExpenseCategory::Internet)->monthly(2)->cancelledOn('2026-06-30'));

    return $user;
}

test('sums the tiles over the subscriptions still debiting', function (): void {
    // Nordlys 2 400 HT + 20 % = 2 880 a month; Orvella 9 000 exempt a quarter → 3 000 a month;
    // Kestrel 48 000 self-assessed at 20 %, half professional: 9 600 due, 4 800 recoverable, 4 000 a month provisioned.
    $this->actingAs(subscribedAccount())
        ->getJson('/api/subscriptions')
        ->assertOk()
        ->assertJsonPath('kpis.monthlyTtc.amount', 5_880)
        ->assertJsonPath('kpis.monthlyCount', 2)
        ->assertJsonPath('kpis.yearlyTtc.amount', 48_000)
        ->assertJsonPath('kpis.annualCount', 1)
        ->assertJsonPath('kpis.provisionedCount', 1)
        ->assertJsonPath('kpis.provisionedPerMonth.amount', 4_000)
        ->assertJsonPath('kpis.recoverableVatPerYear.amount', 5_760 + 4_800)
        ->assertJsonPath('kpis.reverseChargedVatPerYear.amount', 9_600)
        ->assertJsonPath('yearlyHt.amount', 28_800 + 36_000 + 48_000);
});

test('lists the next thirty days of debits, provisions included, soonest first', function (): void {
    // 13 August → 12 September: Orvella on the 20th, Kestrel's annual on 1 September
    // and its September twelfth on the 1st, Nordlys on the 5th; the paused and
    // cancelled lines are silent.
    $this->actingAs(subscribedAccount())
        ->getJson('/api/subscriptions')
        ->assertOk()
        ->assertJsonCount(4, 'upcoming')
        ->assertJsonPath('upcoming.0.supplier', 'Orvella Assurances')
        ->assertJsonPath('upcoming.0.dueOn', '2026-08-20')
        ->assertJsonPath('upcoming.0.amountTtc.amount', 9_000)
        ->assertJsonPath('upcoming.1.dueOn', '2026-09-01')
        ->assertJsonPath('upcoming.1.isProvision', false)
        ->assertJsonPath('upcoming.1.amountTtc.amount', 48_000)
        ->assertJsonPath('upcoming.2.dueOn', '2026-09-01')
        ->assertJsonPath('upcoming.2.isProvision', true)
        ->assertJsonPath('upcoming.2.amountTtc.amount', 4_000)
        ->assertJsonPath('upcoming.3.supplier', 'Nordlys Cloud')
        ->assertJsonPath('upcoming.3.dueOn', '2026-09-05');
});

test('splits the year by category, largest first', function (): void {
    $this->actingAs(subscribedAccount())
        ->getJson('/api/subscriptions')
        ->assertOk()
        ->assertJsonPath('categories.0.category', ExpenseCategory::Software->value)
        ->assertJsonPath('categories.0.yearlyHt.amount', 48_000)
        ->assertJsonPath('categories.1.category', ExpenseCategory::Insurance->value)
        ->assertJsonPath('categories.1.yearlyHt.amount', 36_000)
        ->assertJsonPath('categories.2.category', ExpenseCategory::Hosting->value)
        ->assertJsonPath('categories.2.yearlyHt.amount', 28_800)
        ->assertJsonMissingPath('categories.3');
});

test('draws the twelve-month strip of each subscription', function (): void {
    $user = User::factory()->create();
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->monthly(5)->startedOn('2026-01-05')->recordedOn('2026-06-01'));

    $response = $this->actingAs($user)->getJson('/api/subscriptions')->assertOk();
    $strip = collect($response->json('subscriptions.0.occurrences'));

    // September 2025 to August 2026: four months before the start are absent,
    // January to May predate the record, June to August were created and wait
    // for their receipts.
    expect($strip->pluck('period')->all())->toBe(['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08'])
        ->and($strip->firstWhere('period', '2026-03')['state'])->toBe(4)
        ->and($strip->firstWhere('period', '2026-07')['state'])->toBe(1)
        ->and($strip->firstWhere('period', '2026-07')['expenseId'])->not->toBeNull();

    $response->assertJsonPath('kpis.missingReceipts', 3);

    $expense = $user->expenses()->where('subscription_period_key', '2026-07')->sole();
    attachReceiptTo($user, $expense)->assertCreated();

    $this->actingAs($user)->getJson('/api/subscriptions')->assertOk()
        ->assertJsonPath('subscriptions.0.occurrences.6.state', 0)
        ->assertJsonPath('kpis.missingReceipts', 2);
});

test('never lists another account subscriptions', function (): void {
    subscribedAccount();

    $this->actingAs(User::factory()->create())
        ->getJson('/api/subscriptions')
        ->assertOk()
        ->assertJsonPath('subscriptions', [])
        ->assertJsonPath('kpis.monthlyCount', 0);
});

test('the tab runs a bounded number of queries', function (): void {
    $user = subscribedAccount();
    // The first read writes the debits that came due; the budget is the read.
    $this->actingAs($user)->getJson('/api/subscriptions')->assertOk();

    $queries = queriesDuring(fn () => test()->actingAs($user)->getJson('/api/subscriptions')->assertOk());

    expect($queries)->toBeLessThanOrEqual(13);
});
