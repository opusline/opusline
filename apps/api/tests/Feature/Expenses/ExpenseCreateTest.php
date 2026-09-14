<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Users\Models\User;
use Illuminate\Testing\TestResponse;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * @param  array<string, mixed>  $overrides
 */
function createExpense(User $user, array $overrides = []): TestResponse
{
    return test()->actingAs($user)->postJson('/api/expenses', [
        'supplier' => 'Brouillard Hébergement',
        'spentOn' => '2026-08-10',
        'category' => ExpenseCategory::Hosting->value,
        'amountTtc' => ['amount' => 1_439, 'currency' => 'EUR'],
        'vatTreatment' => ExpenseVatTreatment::Domestic->value,
        'vatRateBp' => 2_000,
        'description' => 'VPS + domaine',
        ...$overrides,
    ]);
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
