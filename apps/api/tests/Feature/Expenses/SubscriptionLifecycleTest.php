<?php

declare(strict_types=1);

use App\Domain\Expenses\Factories\SubscriptionFactory;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('a dated price change re-prices the debits from that day', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->startedOn('2026-01-05'));

    $this->actingAs($user)
        ->postJson("/api/subscriptions/{$subscription->id}/amounts", ['amountHt' => ['amount' => 2_900, 'currency' => 'EUR'], 'effectiveFrom' => '2026-06-01'])
        ->assertCreated()
        ->assertJsonPath('subscriptions.0.amountHt.amount', 2_900)
        ->assertJsonPath('amountChanges.0.since', '2026-06-01')
        ->assertJsonPath('amountChanges.0.changeBp', 2_083);

    // A change dated ahead waits: today's price and the change card stay put.
    $this->actingAs($user)
        ->postJson("/api/subscriptions/{$subscription->id}/amounts", ['amountHt' => ['amount' => 3_100, 'currency' => 'EUR'], 'effectiveFrom' => '2026-10-01'])
        ->assertCreated()
        ->assertJsonPath('subscriptions.0.amountHt.amount', 2_900)
        ->assertJsonCount(3, 'subscriptions.0.amounts')
        ->assertJsonPath('amountChanges.0.after.amount', 2_900);
});

test('a second change dated the same day replaces the first', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user);

    foreach ([2_900, 3_000] as $htCents) {
        $this->actingAs($user)
            ->postJson("/api/subscriptions/{$subscription->id}/amounts", ['amountHt' => ['amount' => $htCents, 'currency' => 'EUR'], 'effectiveFrom' => '2026-06-01'])
            ->assertCreated();
    }

    expect($subscription->amounts()->count())->toBe(2)
        ->and((int) $subscription->priceOn(CarbonImmutable::parse('2026-07-01'))->getAmount())->toBe(3_000);
});

test('a price change cannot predate the first debit', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->startedOn('2026-01-05'));

    $this->actingAs($user)
        ->postJson("/api/subscriptions/{$subscription->id}/amounts", ['amountHt' => ['amount' => 2_900, 'currency' => 'EUR'], 'effectiveFrom' => '2025-12-01'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('effectiveFrom');

    expect($subscription->amounts()->count())->toBe(1);
});

test('a price edited before the first debit rewrites the opening price', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->startedOn('2026-10-05'));

    $this->actingAs($user)
        ->putJson("/api/subscriptions/{$subscription->id}", subscriptionPayload(['startedOn' => '2026-10-05', 'amountHt' => ['amount' => 2_900, 'currency' => 'EUR']]))
        ->assertOk()
        ->assertJsonCount(1, 'subscriptions.0.amounts')
        ->assertJsonPath('subscriptions.0.amounts.0.effectiveFrom', '2026-10-05')
        ->assertJsonPath('subscriptions.0.amounts.0.amountHt.amount', 2_900)
        ->assertJsonPath('subscriptions.0.nextDebitOn', '2026-10-05');
});

test('pausing skips the debits until resumed', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user);

    $this->actingAs($user)
        ->postJson("/api/subscriptions/{$subscription->id}/pause")
        ->assertCreated()
        ->assertJsonPath('subscriptions.0.isPaused', true)
        ->assertJsonPath('subscriptions.0.nextDebitOn', null)
        ->assertJsonPath('kpis.monthlyCount', 0)
        ->assertJsonPath('upcoming', []);

    $this->actingAs($user)
        ->deleteJson("/api/subscriptions/{$subscription->id}/pause")
        ->assertOk()
        ->assertJsonPath('subscriptions.0.isPaused', false)
        ->assertJsonPath('subscriptions.0.nextDebitOn', '2026-09-05')
        ->assertJsonPath('kpis.monthlyCount', 1);
});

test('cancelling ends the debits today unless a day is given, and reactivating undoes it', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user);

    $this->actingAs($user)
        ->postJson("/api/subscriptions/{$subscription->id}/cancellation")
        ->assertCreated()
        ->assertJsonPath('subscriptions.0.cancelledOn', '2026-08-13')
        ->assertJsonPath('subscriptions.0.nextDebitOn', null)
        ->assertJsonPath('kpis.monthlyCount', 0);

    // Dated ahead, the subscription still debits until then.
    $this->actingAs($user)
        ->postJson("/api/subscriptions/{$subscription->id}/cancellation", ['cancelledOn' => '2026-09-30'])
        ->assertCreated()
        ->assertJsonPath('subscriptions.0.cancelledOn', '2026-09-30')
        ->assertJsonPath('subscriptions.0.nextDebitOn', '2026-09-05')
        ->assertJsonPath('kpis.monthlyCount', 1)
        ->assertJsonPath('upcoming.0.dueOn', '2026-09-05');

    $this->actingAs($user)
        ->deleteJson("/api/subscriptions/{$subscription->id}/cancellation")
        ->assertOk()
        ->assertJsonPath('subscriptions.0.cancelledOn', null)
        ->assertJsonPath('kpis.monthlyCount', 1);
});

test('lists the subscriptions still debiting first, then the paused, the ended last', function (): void {
    $user = User::factory()->create();
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->state(['supplier' => 'Aster Télécom'])->cancelledOn('2026-06-30'));
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->state(['supplier' => 'Nordlys Cloud']));
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->state(['supplier' => 'Callisto Télécom'])->paused());
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->state(['supplier' => 'Boréal Assurances'])->cancelledOn('2026-12-31'));

    $this->actingAs($user)
        ->getJson('/api/subscriptions')
        ->assertOk()
        ->assertJsonPath('subscriptions.0.supplier', 'Boréal Assurances')
        ->assertJsonPath('subscriptions.1.supplier', 'Nordlys Cloud')
        ->assertJsonPath('subscriptions.2.supplier', 'Callisto Télécom')
        ->assertJsonPath('subscriptions.3.supplier', 'Aster Télécom');
});
