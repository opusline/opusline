<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Users\Models\User;
use Illuminate\Testing\TestResponse;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * @return array<string, mixed>
 */
function expensePayload(): array
{
    return [
        'supplier' => 'Brouillard Hébergement',
        'spentOn' => '2026-08-10',
        'category' => ExpenseCategory::Hosting->value,
        'amountTtc' => ['amount' => 1_439, 'currency' => 'EUR'],
        'vatTreatment' => ExpenseVatTreatment::Domestic->value,
        'vatRateBp' => 2_000,
        'description' => 'VPS + domaine',
    ];
}

/**
 * @param  array<string, mixed>  $overrides
 */
function createExpense(User $user, array $overrides = []): TestResponse
{
    return test()->actingAs($user)->postJson('/api/expenses', [...expensePayload(), ...$overrides]);
}

test('records a purchase and answers with its month, the net amount derived from the gross one', function (): void {
    $user = User::factory()->create();

    createExpense($user)
        ->assertCreated()
        ->assertJsonPath('month', '2026-08')
        ->assertJsonPath('expenses.0.supplier', 'Brouillard Hébergement')
        ->assertJsonPath('expenses.0.spentOn', '2026-08-10')
        ->assertJsonPath('expenses.0.category', ExpenseCategory::Hosting->value)
        ->assertJsonPath('expenses.0.amountTtc.amount', 1_439)
        ->assertJsonPath('expenses.0.amountHt.amount', 1_199)
        ->assertJsonPath('expenses.0.vat.amount', 240)
        ->assertJsonPath('expenses.0.recoverableVat.amount', 240)
        ->assertJsonPath('expenses.0.proShareBp', 10_000)
        ->assertJsonPath('totals.count', 1)
        ->assertJsonPath('totals.ht.amount', 1_199);

    $this->assertDatabaseHas('expenses', [
        'user_id' => $user->id,
        'supplier' => 'Brouillard Hébergement',
        'spent_on' => '2026-08-10',
        'amount_ttc_cents' => 1_439,
        'amount_ht_cents' => 1_199,
        'currency' => 'EUR',
    ]);
});

test('a purchase can be recorded as a subscription debit', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user, fn ($factory) => $factory->state(['auto_create_expenses' => false]));

    createExpense($user, ['subscriptionId' => $subscription->id])
        ->assertCreated()
        ->assertJsonPath('expenses.0.subscription.id', $subscription->id);

    $this->assertDatabaseHas('expenses', ['subscription_id' => $subscription->id, 'subscription_period_key' => '2026-08']);
});

test('refuses a second debit for the same period', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user, fn ($factory) => $factory->state(['auto_create_expenses' => false]));
    createExpense($user, ['subscriptionId' => $subscription->id])->assertCreated();

    createExpense($user, ['subscriptionId' => $subscription->id])->assertConflict();
});

test('refuses an unknown subscription, and tying both ways at once', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user);

    createExpense($user, ['subscriptionId' => 999_999])->assertUnprocessable()->assertJsonValidationErrors('subscriptionId');
    createExpense($user, ['subscriptionId' => $subscription->id, 'recurringDebitDay' => 5])->assertUnprocessable()->assertJsonValidationErrors('recurringDebitDay');
});

test('a recurring purchase creates its monthly subscription on the spot', function (): void {
    $user = User::factory()->create();

    createExpense($user, ['recurringDebitDay' => 10])
        ->assertCreated()
        ->assertJsonPath('expenses.0.subscription.supplier', 'Brouillard Hébergement')
        ->assertJsonPath('expenses.0.subscription.periodicity', 0);

    $subscription = $user->subscriptions()->sole();

    expect($subscription->debit_day)->toBe(10)
        ->and($subscription->started_on->toDateString())->toBe('2026-08-10')
        ->and((int) $subscription->priceOn($subscription->started_on)->getAmount())->toBe(1_199)
        ->and($user->expenses()->count())->toBe(1);
});

test('a debit cannot be re-tied on update, though the sheet may echo the tie in place', function (): void {
    $user = User::factory()->create();
    $subscription = subscriptionOwnedBy($user, fn ($factory) => $factory->state(['auto_create_expenses' => false]));
    $expense = expenseOwnedBy($user, fn ($factory) => $factory->state(['subscription_id' => $subscription->id, 'subscription_period_key' => '2026-08']));

    $this->actingAs($user)
        ->putJson("/api/expenses/{$expense->id}", [...expensePayload(), 'subscriptionId' => $subscription->id])
        ->assertOk();
    $this->actingAs($user)
        ->putJson("/api/expenses/{$expense->id}", [...expensePayload(), 'recurringDebitDay' => 5])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('subscriptionId');
});

test('a reverse-charged purchase self-assesses the TVA and keeps net equal to gross', function (): void {
    createExpense(User::factory()->create(), [
        'amountTtc' => ['amount' => 4_800, 'currency' => 'EUR'],
        'vatTreatment' => ExpenseVatTreatment::ReverseChargeNonEu->value,
        'proShareBp' => 7_000,
    ])
        ->assertCreated()
        ->assertJsonPath('expenses.0.amountHt.amount', 4_800)
        ->assertJsonPath('expenses.0.vat.amount', 960)
        ->assertJsonPath('expenses.0.recoverableVat.amount', 672);
});

test('an exempt purchase carries no TVA', function (): void {
    createExpense(User::factory()->create(), [
        'vatTreatment' => ExpenseVatTreatment::Exempt->value,
        'vatRateBp' => 0,
    ])
        ->assertCreated()
        ->assertJsonPath('expenses.0.vat.amount', 0)
        ->assertJsonPath('expenses.0.amountHt.amount', 1_439);
});

test('refuses a purchase dated in the future', function (): void {
    createExpense(User::factory()->create(), ['spentOn' => '2026-08-14'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('spentOn');
});

test('refuses an amount of zero', function (): void {
    createExpense(User::factory()->create(), ['amountTtc' => ['amount' => 0, 'currency' => 'EUR']])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('amountTtc.amount');
});

test('refuses a currency the account does not use', function (): void {
    createExpense(User::factory()->create(), ['amountTtc' => ['amount' => 1_439, 'currency' => 'CHF']])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('amountTtc.currency');
});

test('accepts any rate in basis points, not only the French ones', function (): void {
    createExpense(User::factory()->create(), ['vatRateBp' => 1_900])
        ->assertCreated()
        ->assertJsonPath('expenses.0.amountHt.amount', 1_209);
});

test('refuses a rate above the whole', function (): void {
    createExpense(User::factory()->create(), ['vatRateBp' => 10_001])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('vatRateBp');
});

test('refuses a date before the journal can show it', function (): void {
    createExpense(User::factory()->create(), ['spentOn' => '1899-12-31'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('spentOn');
});

test('refuses a rate that contradicts the treatment', function (int $treatment, int $rateBp): void {
    createExpense(User::factory()->create(), ['vatTreatment' => $treatment, 'vatRateBp' => $rateBp])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('vatRateBp');
})->with([
    'an exempt purchase at 20 %' => [ExpenseVatTreatment::Exempt->value, 2_000],
    'a reverse charge at 0 %' => [ExpenseVatTreatment::ReverseChargeEu->value, 0],
]);

test('a domestic purchase may carry no rate, as a franchise account records it', function (): void {
    createExpense(User::factory()->create(), ['vatRateBp' => 0])
        ->assertCreated()
        ->assertJsonPath('expenses.0.amountHt.amount', 1_439)
        ->assertJsonPath('expenses.0.vat.amount', 0);
});

test('refuses a professional share above the whole', function (): void {
    createExpense(User::factory()->create(), ['proShareBp' => 10_001])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('proShareBp');
});

test('refuses a supplier name longer than the column', function (): void {
    createExpense(User::factory()->create(), ['supplier' => str_repeat('x', 121)])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('supplier');
});

test('a recorded expense locks the account currency', function (): void {
    $user = User::factory()->create();
    expenseOwnedBy($user);

    expect($user->hasLockedCurrency())->toBeTrue();
});

test('requires authentication', function (): void {
    $this->postJson('/api/expenses', [])->assertUnauthorized();
});
