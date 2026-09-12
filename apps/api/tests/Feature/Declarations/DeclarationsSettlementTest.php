<?php

declare(strict_types=1);

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Expenses\Factories\ExpenseFactory;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * A monthly account started this year — so the CFE is exempt and the URSSAF
 * provision is the only one — with 1 650 € HT collected in July and a known
 * balance on the compte pro.
 */
function settledAccount(int $balanceCents = 1_000_000): User
{
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'business_started_on' => '2026-01-15',
        'contribution_rate_bp' => 2_500,
        'liberating_payment' => false,
        'bank_balance_cents' => $balanceCents,
        'bank_balance_recorded_on' => '2026-08-13',
    ]);
    paidInvoiceOn($user, '2026-07-10');

    return $user;
}

test('reads the expected total and the payment detected the period after', function (): void {
    $user = settledAccount();
    fiscDebitOn($user, '2026-08-20', 41_580, 'PRLV URSSAF JUILLET');
    fiscDebitOn($user, '2026-07-20', 20_000, 'PRLV URSSAF JUIN');

    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-07')
        ->assertOk()
        ->assertJsonPath('urssaf.settlement.expected.amount', 41_580)
        ->assertJsonPath('urssaf.settlement.detectedPayments.amount', 41_580);
});

test('matches the carried period against what the balance can still cover', function (int $balanceCents, int $provisioned, int $gap): void {
    $this->actingAs(settledAccount($balanceCents))
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('urssaf.settlement.provisioned.amount', $provisioned)
        ->assertJsonPath('urssaf.settlement.gap.amount', $gap);
})->with([
    'the balance covers the carry' => [1_000_000, 41_580, 0],
    'the balance covers part of it' => [30_000, 30_000, -11_580],
    'an overdrawn account holds nothing' => [-5_000, 0, -41_580],
]);

test('a paid return is no longer matched against the provision', function (): void {
    $user = settledAccount();
    FiscalDeadlineCompletion::factory()->for($user)->of(FiscalDeadlineKind::UrssafDeclaration, '2026-07')
        ->completedOn('2026-08-10')->paidOn('2026-08-12')->create();

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('urssaf.settlement.provisioned', null)
        ->assertJsonPath('urssaf.settlement.gap', null);
});

test('an older period has no provision to match', function (): void {
    $this->actingAs(settledAccount())
        ->getJson('/api/declarations?period=2026-06')
        ->assertOk()
        ->assertJsonPath('urssaf.settlement.expected.amount', 0)
        ->assertJsonPath('urssaf.settlement.provisioned', null);
});

test('an account with no known balance matches nothing', function (): void {
    $user = settledAccount();
    $user->settings()->sole()->update(['bank_balance_cents' => null, 'bank_balance_recorded_on' => null]);

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('urssaf.settlement.provisioned', null);
});

test('the CA3 block settles case 32 the same way, the other provisions taken off first', function (): void {
    $user = settledAccount(balanceCents: 60_000);
    vatLiable($user);
    receiptedExpenseOwnedBy($user, fn (ExpenseFactory $factory): ExpenseFactory => $factory->on('2026-07-20')->ttc(120_000));
    fiscDebitOn($user, '2026-08-12', 13_000, 'TELEREGLEMENT TVA CA3 JUILLET');

    // July owes 33 000 − 20 000 = 13 000 of TVA and 41 580 to the URSSAF. The
    // télérèglement settled the TVA carry, so the engine holds 41 580 for the
    // URSSAF and nothing for the TVA; the 60 000 covers the URSSAF in full.
    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('vat.settlement.expected.amount', 13_000)
        ->assertJsonPath('vat.settlement.detectedPayments.amount', 13_000)
        ->assertJsonPath('vat.settlement.provisioned.amount', 0)
        ->assertJsonPath('urssaf.settlement.provisioned.amount', 41_580)
        ->assertJsonPath('urssaf.settlement.gap.amount', 0);
});

test('a quarter still carried does not lend its provision to an older CA3', function (): void {
    $user = settledAccount();
    $user->settings()->sole()->update(['urssaf_periodicity' => UrssafPeriodicity::Quarterly]);
    vatLiable($user);
    paidInvoiceOn($user, '2026-05-10');

    // Q2 is the quarter the engine carries (the July invoice sits in the
    // running Q3), so April's URSSAF block matches it — but April's CA3 was
    // three returns ago and holds nothing.
    $this->actingAs($user)
        ->getJson('/api/declarations?period=2026-04')
        ->assertOk()
        ->assertJsonPath('urssaf.period', '2026-Q2')
        ->assertJsonPath('urssaf.settlement.provisioned.amount', 41_580)
        ->assertJsonPath('vat.settlement.provisioned', null);
});

test('reads nothing from the bank for a period the engine does not carry', function (): void {
    $user = settledAccount();

    $queries = queriesDuring(fn () => test()->actingAs($user)->getJson('/api/declarations?period=2026-05')->assertOk());
    $carried = queriesDuring(fn () => test()->actingAs($user)->getJson('/api/declarations')->assertOk());

    expect($queries)->toBeLessThan($carried);
});
