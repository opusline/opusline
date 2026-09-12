<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatStatus;
use App\Domain\Expenses\Factories\SubscriptionFactory;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** A monthly host recorded on 1 June with a start in January: only the debits since June exist. */
function nordlysRecordedOn(User $user, string $recordedOn = '2026-06-01'): Subscription
{
    return subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory
        ->named('Nordlys Cloud', ExpenseCategory::Hosting)->monthly(5)->startedOn('2026-01-05')->recordedOn($recordedOn));
}

test('reading the journal creates the debits that came due since the subscription was recorded', function (): void {
    $user = User::factory()->create();
    $subscription = nordlysRecordedOn($user);

    $this->actingAs($user)->getJson('/api/expenses?month=2026-07')->assertOk()
        ->assertJsonCount(1, 'expenses')
        ->assertJsonPath('expenses.0.supplier', 'Nordlys Cloud')
        ->assertJsonPath('expenses.0.spentOn', '2026-07-05')
        ->assertJsonPath('expenses.0.amountHt.amount', 2_400)
        ->assertJsonPath('expenses.0.amountTtc.amount', 2_880)
        ->assertJsonPath('expenses.0.subscription.id', $subscription->id)
        ->assertJsonPath('expenses.0.subscription.periodicity', 0);

    // June, July and August came due; January to May predate the record.
    expect($user->expenses()->count())->toBe(3)
        ->and($user->expenses()->pluck('subscription_period_key')->sort()->values()->all())->toBe(['2026-06', '2026-07', '2026-08']);
});

test('a second read creates nothing more', function (): void {
    $user = User::factory()->create();
    nordlysRecordedOn($user);

    $this->actingAs($user)->getJson('/api/expenses')->assertOk();
    $this->actingAs($user)->getJson('/api/subscriptions')->assertOk();

    expect($user->expenses()->count())->toBe(3);
});

test('a debit is priced at the amount in force on its day', function (): void {
    $user = User::factory()->create();
    $subscription = nordlysRecordedOn($user);
    $subscription->amounts()->create(['effective_from' => '2026-07-01', 'currency' => 'EUR', 'amount_ht_cents' => 2_900]);

    $this->actingAs($user)->getJson('/api/expenses?month=2026-06')->assertOk()
        ->assertJsonPath('expenses.0.amountHt.amount', 2_400);
    $this->actingAs($user)->getJson('/api/expenses?month=2026-07')->assertOk()
        ->assertJsonPath('expenses.0.amountHt.amount', 2_900);
});

test('a paused, cancelled or manual subscription writes nothing', function (callable $configure, int $expected): void {
    $user = User::factory()->create();
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $configure($factory->monthly(5)->startedOn('2026-06-05')->recordedOn('2026-06-01')));

    $this->actingAs($user)->getJson('/api/expenses')->assertOk();

    expect($user->expenses()->count())->toBe($expected);
})->with([
    'paused' => [fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->paused(), 0],
    'cancelled after one debit' => [fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->cancelledOn('2026-06-30'), 1],
    'expenses entered by hand' => [fn (SubscriptionFactory $factory): SubscriptionFactory => $factory->state(['auto_create_expenses' => false]), 0],
]);

test('resuming a paused subscription skips the months it was paused for', function (): void {
    $user = User::factory()->create();
    $subscription = nordlysRecordedOn($user);
    $this->actingAs($user)->getJson('/api/expenses?month=2026-06')->assertOk();
    $this->actingAs($user)->postJson("/api/subscriptions/{$subscription->id}/pause")->assertCreated();
    // Paused before July and August were ever read: nothing was written for them.
    $user->expenses()->where('spent_on', '>=', '2026-07-01')->forceDelete();

    $this->actingAs($user)->deleteJson("/api/subscriptions/{$subscription->id}/pause")->assertOk();
    $this->actingAs($user)->getJson('/api/expenses')->assertOk();

    // June was written before the pause; July and August fell inside it.
    expect($user->expenses()->pluck('subscription_period_key')->all())->toBe(['2026-06']);
});

test('a deleted debit does not come back on the next read', function (): void {
    $user = User::factory()->create();
    nordlysRecordedOn($user);
    $this->actingAs($user)->getJson('/api/expenses')->assertOk();
    $july = $user->expenses()->where('subscription_period_key', '2026-07')->sole();

    $this->actingAs($user)->deleteJson("/api/expenses/{$july->id}")->assertNoContent();
    $this->actingAs($user)->getJson('/api/expenses?month=2026-07')->assertOk()->assertJsonPath('expenses', []);

    expect($user->expenses()->count())->toBe(2);
});

test('the run rate counts an annual debit once, even in its own month', function (): void {
    $user = User::factory()->create();
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory
        ->named('Orvella Assurances', ExpenseCategory::Insurance)->exempt()->annual(15, 3)->startedOn('2026-03-15')->recordedOn('2026-03-01')->priced(31_200));
    expenseOwnedBy($user, fn ($factory) => $factory->on('2026-03-20')->ttc(12_000));

    // March holds the 31 200 debit and a 10 000 one-off: 10 000 × 12 + 31 200.
    $this->actingAs($user)->getJson('/api/expenses?month=2026-03')->assertOk()
        ->assertJsonPath('totals.ht.amount', 41_200)
        ->assertJsonPath('projection.projectedChargesHt.amount', 151_200);
});

test('a debit landing on a declared month claims its TVA on the next open one', function (): void {
    $user = vatLiableUser();
    nordlysRecordedOn($user);
    ca3DeclaredFor($user, '2026-07', '2026-08-10');

    $this->actingAs($user)->getJson('/api/expenses?month=2026-07')->assertOk()
        ->assertJsonPath('expenses.0.vatClaimPeriod', '2026-08')
        ->assertJsonPath('expenses.0.vatStatus', ExpenseVatStatus::Blocked->value);
});

test('the journal tallies the subscriptions and files their debits under one bar', function (): void {
    $user = User::factory()->create();
    nordlysRecordedOn($user);
    subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory
        ->named('Orvella Assurances', ExpenseCategory::Insurance)->exempt()->annual(15, 3)->startedOn('2026-03-15')->priced(31_200));
    expenseOwnedBy($user, fn ($factory) => $factory->on('2026-07-20')->ttc(12_000));

    // 2 400 × 12 + 31 200 = 60 000 HT a year; 2 880 × 12 + 31 200 = 65 760 TTC.
    $this->actingAs($user)->getJson('/api/expenses?month=2026-07')->assertOk()
        ->assertJsonPath('subscriptions.yearlyHt.amount', 60_000)
        ->assertJsonPath('subscriptions.monthlyHt.amount', 5_000)
        ->assertJsonPath('subscriptions.monthlyTtc.amount', 5_480)
        ->assertJsonPath('subscriptions.count', 2)
        ->assertJsonPath('subscriptions.annualCount', 1)
        ->assertJsonPath('categories.0.category', ExpenseCategory::Phone->value)
        ->assertJsonPath('categories.0.ht.amount', 10_000)
        ->assertJsonPath('categories.1.category', null)
        ->assertJsonPath('categories.1.ht.amount', 2_400)
        // The run rate: the 10 000 one-off × 12, plus a year of both subscriptions.
        ->assertJsonPath('projection.projectedChargesHt.amount', 10_000 * 12 + 60_000);
});

test('the rail lists the debits still without a receipt and the annual debit ahead', function (): void {
    $user = User::factory()->create();
    nordlysRecordedOn($user);
    $annual = subscriptionOwnedBy($user, fn (SubscriptionFactory $factory): SubscriptionFactory => $factory
        ->named('Kestrel Devtools', ExpenseCategory::Software)->annual(1, 9)->startedOn('2025-09-01')->priced(48_000));

    $this->actingAs($user)->getJson('/api/expenses?month=2026-08')->assertOk()
        ->assertJsonCount(2, 'todo')
        ->assertJsonPath('todo.0.kind', 0)
        ->assertJsonPath('todo.0.label', 'Nordlys Cloud')
        ->assertJsonPath('todo.0.date', '2026-08-05')
        ->assertJsonPath('todo.0.amount.amount', 2_880)
        ->assertJsonPath('todo.1.kind', 2)
        ->assertJsonPath('todo.1.subscriptionId', $annual->id)
        ->assertJsonPath('todo.1.date', '2026-09-01')
        ->assertJsonPath('todo.1.amount.amount', 57_600);
});
