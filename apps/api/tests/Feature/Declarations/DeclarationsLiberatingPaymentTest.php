<?php

declare(strict_types=1);

use App\Domain\Declarations\Enums\LiberatingPaymentEndReason;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * An account paying the versement libératoire, with what its avis says when
 * given: today is 13 August 2026, so the 2025 avis is the latest one.
 */
function liberatedAccount(?int $incomeCents = null, ?int $incomeYear = null, int $quarterParts = 4): User
{
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'liberating_payment' => true,
        'reference_tax_income_cents' => $incomeCents,
        'reference_tax_income_year' => $incomeCents === null ? null : $incomeYear,
        'tax_household_quarter_parts' => $incomeCents === null ? null : $quarterParts,
    ]);

    return $user;
}

test('has nothing to say without the versement libératoire', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('liberatingPayment', null);
});

test('asks for a revenu fiscal de référence while none vouches for the running year', function (?int $incomeYear): void {
    $user = $incomeYear === null ? liberatedAccount() : liberatedAccount(2_000_000, $incomeYear);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('liberatingPayment.needsReferenceTaxIncome', true)
        ->assertJsonPath('liberatingPayment.endsOn', null);
})->with([
    'none entered' => [null],
    'the 2023 avis, which decided 2025' => [2023],
]);

test('ends the option on the 1 January two years after an income over the limit', function (): void {
    // 2025's income decides 2027, whose limit is 29 579 € for one part.
    $this->actingAs(liberatedAccount(2_957_901, 2025))
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('liberatingPayment.endsOn', '2027-01-01')
        ->assertJsonPath('liberatingPayment.reason', LiberatingPaymentEndReason::ReferenceTaxIncome->value)
        ->assertJsonPath('liberatingPayment.referenceTaxIncome.amount', 2_957_901)
        ->assertJsonPath('liberatingPayment.referenceTaxIncomeYear', 2025)
        ->assertJsonPath('liberatingPayment.referenceTaxIncomeLimit.amount', 2_957_900)
        ->assertJsonPath('liberatingPayment.taxHouseholdQuarterParts', 4)
        ->assertJsonPath('liberatingPayment.needsReferenceTaxIncome', false);
});

test('keeps the option for an income at the limit', function (): void {
    $this->actingAs(liberatedAccount(2_957_900, 2025))
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('liberatingPayment.endsOn', null)
        ->assertJsonPath('liberatingPayment.reason', null);
});

test('raises the limit with the household\'s parts', function (int $quarterParts, ?string $endsOn): void {
    // 44 368 €: over one part's 29 579 €, exactly one and a half parts' 44 368,50 €.
    $this->actingAs(liberatedAccount(4_436_800, 2025, $quarterParts))
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('liberatingPayment.endsOn', $endsOn);
})->with([
    'one part' => [4, '2027-01-01'],
    'one and a half parts' => [6, null],
]);

test('says the option already stopped when the income deciding this year was over', function (): void {
    // 2024's income decided 2026, whose limit was 29 315 € for one part.
    $this->actingAs(liberatedAccount(3_000_000, 2024))
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('liberatingPayment.endsOn', '2026-01-01')
        ->assertJsonPath('liberatingPayment.referenceTaxIncomeLimit.amount', 2_931_500);
});

test('claims nothing for a year whose limit the law has not set', function (): void {
    $this->actingAs(liberatedAccount(9_000_000, 2026))
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('liberatingPayment.endsOn', null)
        ->assertJsonPath('liberatingPayment.needsReferenceTaxIncome', false);
});

test('ends the option after a second year over the micro-BNC ceiling', function (): void {
    $user = liberatedAccount();
    paidInvoiceOn($user, '2025-06-10', htCents: 7_800_000, ttcCents: 9_360_000);
    paidInvoiceOn($user, '2026-06-10', htCents: 8_400_000, ttcCents: 10_080_000);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('liberatingPayment.endsOn', '2027-01-01')
        ->assertJsonPath('liberatingPayment.reason', LiberatingPaymentEndReason::RevenueCeiling->value)
        ->assertJsonPath('liberatingPayment.ceiling.amount', 8_360_000)
        ->assertJsonPath('liberatingPayment.referenceTaxIncome', null);
});

test('keeps the option after a single year over the micro-BNC ceiling', function (): void {
    $user = liberatedAccount();
    paidInvoiceOn($user, '2025-06-10', htCents: 7_800_000, ttcCents: 9_360_000);
    paidInvoiceOn($user, '2026-06-10', htCents: 8_000_000, ttcCents: 9_600_000);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('liberatingPayment.endsOn', null);
});

test('names the earlier end when both rules end the option', function (): void {
    $user = liberatedAccount(3_000_000, 2025);
    paidInvoiceOn($user, '2024-06-10', htCents: 7_800_000, ttcCents: 9_360_000);
    paidInvoiceOn($user, '2025-06-10', htCents: 7_800_000, ttcCents: 9_360_000);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('liberatingPayment.endsOn', '2026-01-01')
        ->assertJsonPath('liberatingPayment.reason', LiberatingPaymentEndReason::RevenueCeiling->value)
        ->assertJsonPath('liberatingPayment.ceiling.amount', 7_770_000);
});
