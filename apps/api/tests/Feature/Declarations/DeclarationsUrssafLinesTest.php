<?php

declare(strict_types=1);

use App\Domain\Shared\Enums\ContributionLineKind;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

function urssafAccount(bool $liberatingPayment = false): User
{
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'contribution_rate_bp' => 2_500,
        'liberating_payment' => $liberatingPayment,
        'liberating_payment_rate_bp' => 220,
    ]);
    paidInvoiceOn($user, '2026-07-10');
    paidInvoiceOn($user, '2026-07-28');

    return $user;
}

test('settles the base in the lines the site lists, the CFP included', function (): void {
    // 330 000 × 25 % = 82 500; × 0,2 % = 660.
    $this->actingAs(urssafAccount())
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('urssaf.base.amount', 330_000)
        ->assertJsonCount(2, 'urssaf.lines')
        ->assertJsonPath('urssaf.lines.0.kind', ContributionLineKind::SocialContributions->value)
        ->assertJsonPath('urssaf.lines.0.rateBp', 2_500)
        ->assertJsonPath('urssaf.lines.0.amount.amount', 82_500)
        ->assertJsonPath('urssaf.lines.1.kind', ContributionLineKind::Cfp->value)
        ->assertJsonPath('urssaf.lines.1.rateBp', 20)
        ->assertJsonPath('urssaf.lines.1.amount.amount', 660)
        ->assertJsonPath('urssaf.total.amount', 83_160);
});

test('adds the versement libératoire line once opted in', function (): void {
    // 330 000 × 2,2 % = 7 260 on top of the 83 160 of the two other lines.
    $this->actingAs(urssafAccount(liberatingPayment: true))
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonCount(3, 'urssaf.lines')
        ->assertJsonPath('urssaf.lines.2.kind', ContributionLineKind::LiberatingPayment->value)
        ->assertJsonPath('urssaf.lines.2.rateBp', 220)
        ->assertJsonPath('urssaf.lines.2.amount.amount', 7_260)
        ->assertJsonPath('urssaf.total.amount', 90_420);
});

test('a quiet period settles to zero on every line', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('urssaf.lines.0.amount.amount', 0)
        ->assertJsonPath('urssaf.lines.1.amount.amount', 0)
        ->assertJsonPath('urssaf.total.amount', 0);
});

test('rounds each line on its own, as the site does, rather than the total once', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2_600, 'liberating_payment' => false]);
    paidInvoiceOn($user, '2026-07-10', htCents: 12_345, ttcCents: 14_814);

    // 12 345 × 26 % = 3 209,70 → 3 210 and × 0,2 % = 24,69 → 25: 3 235,
    // where 12 345 × 26,2 % = 3 234,39 would have rounded to 3 234.
    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('urssaf.lines.0.amount.amount', 3_210)
        ->assertJsonPath('urssaf.lines.1.amount.amount', 25)
        ->assertJsonPath('urssaf.total.amount', 3_235);
});

test('tallies the year against the micro-BNC ceiling up to the shown month', function (): void {
    $user = User::factory()->create();
    paidInvoiceOn($user, '2025-12-31');
    paidInvoiceOn($user, '2026-01-15');
    paidInvoiceOn($user, '2026-03-02');
    paidInvoiceOn($user, '2026-07-10');
    paidInvoiceOn($user, '2026-08-03');

    // Three invoices of 1 650 € HT between January and July: 4 950 € of the 77 700 € ceiling.
    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('cumulative.year', 2026)
        ->assertJsonPath('cumulative.collectedHt.amount', 495_000)
        ->assertJsonPath('cumulative.ceiling.amount', 7_770_000)
        ->assertJsonPath('cumulative.shareBp', 637)
        ->assertJsonPath('cumulative.margin.amount', 7_275_000);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-03')
        ->assertOk()
        ->assertJsonPath('cumulative.collectedHt.amount', 330_000);
});

test('reports a crossed ceiling as a negative margin', function (): void {
    $user = User::factory()->create();
    paidInvoiceOn($user, '2026-02-10', htCents: 8_000_000, ttcCents: 9_600_000);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('cumulative.shareBp', 10_296)
        ->assertJsonPath('cumulative.margin.amount', -230_000);
});

test('has no ceiling to show outside french fiscality', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'BE']);

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('cumulative', null);
});
