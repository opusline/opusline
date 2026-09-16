<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * An account whose ACRE step ended on 1 July 2026 — 25 % until June, 12 %
 * from July — with 1 650 € HT collected in each of the two months and a known
 * balance on the compte pro. The recorded rows carry the effective rate, CFP
 * included, exactly as a settings save writes them.
 */
function acreStepEndedAccount(): User
{
    $user = repricedAccount();
    $user->settings()->sole()->update([
        'business_started_on' => '2026-01-15',
        'bank_balance_cents' => 1_000_000,
        'bank_balance_recorded_on' => '2026-08-13',
    ]);

    paidInvoiceOn($user, '2026-06-30');
    paidInvoiceOn($user, '2026-07-31');

    return $user;
}

test('prices a repriced month at the rate that applied when it closed', function (): void {
    // 165 000 HT at the 25,2 % June was earned under, not at today's 12,2 %.
    // Only the combined rate was recorded, so the settlement is the one line.
    $this->actingAs(acreStepEndedAccount())
        ->getJson('/api/declarations?period=2026-06')
        ->assertOk()
        ->assertJsonPath('urssaf.total.amount', 41_580)
        ->assertJsonCount(1, 'urssaf.lines')
        ->assertJsonPath('urssaf.lines.0.rateBp', 2_520)
        ->assertJsonPath('urssaf.lines.0.amount.amount', 41_580);
});

test('a month nothing repriced keeps the breakdown the site lists', function (): void {
    // 165 000 × 12 % = 19 800 and × 0,2 % = 330, each rounded on its own.
    $this->actingAs(acreStepEndedAccount())
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonCount(2, 'urssaf.lines')
        ->assertJsonPath('urssaf.lines.0.rateBp', 1_200)
        ->assertJsonPath('urssaf.lines.1.rateBp', 20)
        ->assertJsonPath('urssaf.total.amount', 20_130);
});

test('the six-month strip prices each month at its own rate', function (): void {
    $this->actingAs(acreStepEndedAccount())
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('history.0.period', '2026-07')
        ->assertJsonPath('history.0.urssaf.total.amount', 20_130)
        ->assertJsonPath('history.1.period', '2026-06')
        ->assertJsonPath('history.1.urssaf.total.amount', 41_580);
});

test('the declaration and the treasury name one figure for the same return', function (): void {
    $user = acreStepEndedAccount();

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.carriedPeriods.0.period', '2026-06')
        ->assertJsonPath('provisions.urssaf.carriedPeriods.0.amount.amount', 41_580);

    // The balance covers the carry whole, so the gap only closes if both
    // screens priced June with the same rate.
    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-06')
        ->assertOk()
        ->assertJsonPath('urssaf.settlement.expected.amount', 41_580)
        ->assertJsonPath('urssaf.settlement.provisioned.amount', 41_580)
        ->assertJsonPath('urssaf.settlement.gap.amount', 0);
});

test('an account that never moved its rate is settled from its settings', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2_600, 'liberating_payment' => false]);
    paidInvoiceOn($user, '2026-07-10', htCents: 12_345, ttcCents: 14_814);

    // No history to read: the lines keep rounding one by one, where a single
    // 26,2 % on the base would have come out a cent under.
    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonCount(2, 'urssaf.lines')
        ->assertJsonPath('urssaf.total.amount', 3_235);
});
