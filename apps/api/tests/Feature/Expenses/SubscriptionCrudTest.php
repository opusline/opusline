<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use App\Domain\Expenses\Factories\SubscriptionFactory;
use App\Domain\Users\Models\User;
use Illuminate\Testing\TestResponse;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * @param  array<string, mixed>  $overrides
 */
function createSubscription(User $user, array $overrides = []): TestResponse
{
    return test()->actingAs($user)->postJson('/api/subscriptions', subscriptionPayload($overrides));
}

test('records a subscription with its opening price and answers with the tab', function (): void {
    $user = User::factory()->create();

    createSubscription($user)
        ->assertCreated()
        ->assertJsonCount(1, 'subscriptions')
        ->assertJsonPath('subscriptions.0.supplier', 'Nordlys Cloud')
        ->assertJsonPath('subscriptions.0.amountHt.amount', 2_400)
        ->assertJsonPath('subscriptions.0.vat.amount', 480)
        ->assertJsonPath('subscriptions.0.amountTtc.amount', 2_880)
        ->assertJsonPath('subscriptions.0.recoverableVat.amount', 480)
        ->assertJsonPath('subscriptions.0.periodicity', SubscriptionPeriodicity::Monthly->value)
        ->assertJsonPath('subscriptions.0.nextDebitOn', '2026-09-05')
        ->assertJsonPath('subscriptions.0.isPaused', false)
        ->assertJsonPath('subscriptions.0.cancelledOn', null)
        ->assertJsonPath('subscriptions.0.amounts.0.effectiveFrom', '2026-01-05')
        ->assertJsonPath('subscriptions.0.amounts.0.amountHt.amount', 2_400)
        ->assertJsonPath('kpis.monthlyTtc.amount', 2_880)
        ->assertJsonPath('kpis.monthlyCount', 1);

    $this->assertDatabaseHas('subscriptions', ['user_id' => $user->id, 'supplier' => 'Nordlys Cloud', 'debit_day' => 5, 'currency' => 'EUR']);
    $this->assertDatabaseHas('subscription_amounts', ['effective_from' => '2026-01-05', 'amount_ht_cents' => 2_400]);
});

test('an annual subscription needs its debit month, and only then provisions monthly', function (): void {
    $user = User::factory()->create();

    createSubscription($user, ['periodicity' => SubscriptionPeriodicity::Annual->value, 'provisionMonthly' => true])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('debitMonth');

    createSubscription($user, [
        'periodicity' => SubscriptionPeriodicity::Annual->value,
        'debitDay' => 15,
        'debitMonth' => 3,
        'startedOn' => '2026-03-15',
        'amountHt' => ['amount' => 31_200, 'currency' => 'EUR'],
        'vatTreatment' => ExpenseVatTreatment::Exempt->value,
        'vatRateBp' => 0,
        'provisionMonthly' => true,
    ])
        ->assertCreated()
        ->assertJsonPath('subscriptions.0.debitMonth', 3)
        ->assertJsonPath('subscriptions.0.monthlyProvision.amount', 2_600)
        ->assertJsonPath('subscriptions.0.nextDebitOn', '2027-03-15')
        ->assertJsonPath('kpis.yearlyTtc.amount', 31_200)
        ->assertJsonPath('kpis.provisionedCount', 1)
        ->assertJsonPath('kpis.provisionedPerMonth.amount', 2_600);
});

test('a monthly subscription never provisions, whatever the sheet sent', function (): void {
    createSubscription(User::factory()->create(), ['provisionMonthly' => true, 'debitMonth' => 6])
        ->assertCreated()
        ->assertJsonPath('subscriptions.0.provisionMonthly', false)
        ->assertJsonPath('subscriptions.0.debitMonth', null)
        ->assertJsonPath('subscriptions.0.monthlyProvision', null);
});

test('rejects what the sheet cannot mean', function (array $overrides, string $field): void {
    createSubscription(User::factory()->create(), $overrides)
        ->assertUnprocessable()
        ->assertJsonValidationErrors($field);
})->with([
    'a debit day past the 31st' => [['debitDay' => 32], 'debitDay'],
    'a rate on an exempt subscription' => [['vatTreatment' => ExpenseVatTreatment::Exempt->value, 'vatRateBp' => 2_000], 'vatRateBp'],
    'no rate on a reverse-charged one' => [['vatTreatment' => ExpenseVatTreatment::ReverseChargeEu->value, 'vatRateBp' => 0], 'vatRateBp'],
    'a customer space that is not a URL' => [['customerSpaceUrl' => 'nordlys cloud'], 'customerSpaceUrl'],
    'a price in another currency' => [['amountHt' => ['amount' => 2_400, 'currency' => 'USD']], 'amountHt.currency'],
    'a zero price' => [['amountHt' => ['amount' => 0, 'currency' => 'EUR']], 'amountHt.amount'],
]);

test('replacing the terms keeps the price history and dates a new price today', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->startedOn('2026-01-05'));

    $this->actingAs($user)
        ->putJson("/api/subscriptions/{$subscription->id}", subscriptionPayload([
            'supplier' => 'Nordlys Cloud Pro',
            'amountHt' => ['amount' => 2_900, 'currency' => 'EUR'],
            'debitDay' => 7,
        ]))
        ->assertOk()
        ->assertJsonPath('subscriptions.0.supplier', 'Nordlys Cloud Pro')
        ->assertJsonPath('subscriptions.0.debitDay', 7)
        ->assertJsonPath('subscriptions.0.amountHt.amount', 2_900)
        ->assertJsonCount(2, 'subscriptions.0.amounts')
        ->assertJsonPath('subscriptions.0.amounts.1.effectiveFrom', '2026-08-13')
        ->assertJsonPath('amountChanges.0.before.amount', 2_400)
        ->assertJsonPath('amountChanges.0.after.amount', 2_900)
        ->assertJsonPath('amountChanges.0.changeBp', 2_083)
        ->assertJsonPath('amountChanges.0.since', '2026-08-13');
});

test('replacing the terms with the same price writes no history', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user);

    $this->actingAs($user)
        ->putJson("/api/subscriptions/{$subscription->id}", subscriptionPayload(['description' => 'Plan Pro · 2 sites']))
        ->assertOk()
        ->assertJsonCount(1, 'subscriptions.0.amounts')
        ->assertJsonPath('amountChanges', []);
});

test('deleting a subscription drops its history and answers nothing', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user);

    $this->actingAs($user)->deleteJson("/api/subscriptions/{$subscription->id}")->assertNoContent();

    $this->assertDatabaseMissing('subscriptions', ['id' => $subscription->id]);
    $this->assertDatabaseMissing('subscription_amounts', ['subscription_id' => $subscription->id]);
});

test('a subscription locks the account currency', function (): void {
    $user = User::factory()->create();
    subscriptionOwnedBy($user);

    expect($user->fresh()?->hasLockedCurrency())->toBeTrue();
});

test('every subscription route answers 404 for another account subscription', function (string $method, string $path): void {
    $foreign = subscriptionOwnedBy(User::factory()->create());

    $this->actingAs(User::factory()->create())
        ->json($method, str_replace('{subscription}', (string) $foreign->id, $path))
        ->assertNotFound();
})->with([
    'update' => ['PUT', '/api/subscriptions/{subscription}'],
    'delete' => ['DELETE', '/api/subscriptions/{subscription}'],
    'change amount' => ['POST', '/api/subscriptions/{subscription}/amounts'],
    'pause' => ['POST', '/api/subscriptions/{subscription}/pause'],
    'resume' => ['DELETE', '/api/subscriptions/{subscription}/pause'],
    'cancel' => ['POST', '/api/subscriptions/{subscription}/cancellation'],
    'reactivate' => ['DELETE', '/api/subscriptions/{subscription}/cancellation'],
]);

test('requires authentication', function (): void {
    $this->getJson('/api/subscriptions')->assertUnauthorized();
});
