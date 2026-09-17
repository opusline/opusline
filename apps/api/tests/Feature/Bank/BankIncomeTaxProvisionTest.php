<?php

declare(strict_types=1);

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Settings\Models\ContributionRate;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** A French account off the versement libératoire, with its avis's 7,5 % withholding rate. */
function incomeTaxAccount(array $settings = []): User
{
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'liberating_payment' => false,
        'income_tax_rate_bp' => 750,
        ...$settings,
    ]);

    return $user;
}

test('sets no income tax aside', function (array $settings): void {
    $user = incomeTaxAccount($settings);
    paidInvoiceOn($user, '2026-03-10', htCents: 1_000_000, ttcCents: 1_200_000);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.incomeTax', null);
})->with([
    'without a withholding rate' => [['income_tax_rate_bp' => null]],
    'under the versement libératoire' => [['liberating_payment' => true]],
    'outside french fiscality' => [['business_country' => 'BE']],
]);

test('prices the running year\'s receipts less the abatement at the avis rate', function (int $receiptsCents, int $taxCents): void {
    $user = incomeTaxAccount();
    paidInvoiceOn($user, '2026-03-10', htCents: $receiptsCents, ttcCents: $receiptsCents);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.incomeTax.amount.amount', $taxCents)
        ->assertJsonPath('provisions.incomeTax.carried.amount', 0)
        ->assertJsonPath('provisions.incomeTax.rateBp', 750)
        ->assertJsonPath('provisions.incomeTax.periodEnd', '2026-12-31');
})->with([
    // 10 000 € less 34 % is 6 600 €, at 7,5 %.
    'the 34 % abatement' => [1_000_000, 49_500],
    // 400 € less the 305 € floor is 95 €, at 7,5 %.
    'the abatement floor' => [40_000, 713],
]);

test('carries last year\'s whole bill until its return is marked paid', function (): void {
    $user = incomeTaxAccount();
    // 20 000 € less 34 % is 13 200 €, at 7,5 %.
    paidInvoiceOn($user, '2025-05-10', htCents: 2_000_000, ttcCents: 2_400_000);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.incomeTax.amount.amount', 99_000)
        ->assertJsonPath('provisions.incomeTax.carried.amount', 99_000)
        ->assertJsonPath('provisions.incomeTax.carriedPeriods.0.period', '2025')
        ->assertJsonPath('provisions.incomeTax.paidPeriods', []);
});

test('moves last year\'s bill to the paid side once its return is marked paid', function (): void {
    $user = incomeTaxAccount();
    paidInvoiceOn($user, '2025-05-10', htCents: 2_000_000, ttcCents: 2_400_000);
    FiscalDeadlineCompletion::factory()
        ->for($user)
        ->of(FiscalDeadlineKind::IncomeTaxReturn, '2025')
        ->completedOn('2026-05-20')
        ->paidOn('2026-08-12')
        ->create();

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.incomeTax.amount.amount', 0)
        ->assertJsonPath('provisions.incomeTax.carriedPeriods', [])
        ->assertJsonPath('provisions.incomeTax.paidPeriods.0.period', '2025')
        ->assertJsonPath('provisions.incomeTax.paidPeriods.0.amount.amount', 99_000);
});

test('leaves out the receipts of the months the option was in force', function (): void {
    $user = incomeTaxAccount();
    ContributionRate::query()->create([
        'user_id' => $user->id,
        'effective_rate_bp' => 2_480,
        'liberating_payment' => true,
        'liberating_payment_rate_bp' => 220,
        'effective_from' => '2025-01-01',
    ]);
    ContributionRate::query()->create([
        'user_id' => $user->id,
        'effective_rate_bp' => 2_260,
        'liberating_payment' => false,
        'liberating_payment_rate_bp' => 220,
        'effective_from' => '2026-01-01',
    ]);
    paidInvoiceOn($user, '2025-05-10', htCents: 2_000_000, ttcCents: 2_400_000);
    paidInvoiceOn($user, '2026-03-10', htCents: 1_000_000, ttcCents: 1_200_000);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.incomeTax.amount.amount', 49_500)
        ->assertJsonPath('provisions.incomeTax.carried.amount', 0);
});

test('keeps a bill marked paid off the transferable figure until the balance can show it', function (): void {
    $user = incomeTaxAccount([
        'bank_balance_cents' => 5_000_000,
        'bank_balance_recorded_on' => '2026-08-12',
    ]);
    paidInvoiceOn($user, '2025-05-10', htCents: 2_000_000, ttcCents: 2_000_000);
    FiscalDeadlineCompletion::factory()
        ->for($user)
        ->of(FiscalDeadlineKind::IncomeTaxReturn, '2025')
        ->completedOn('2026-05-20')
        ->paidOn('2026-08-13')
        ->create();

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('provisions.incomeTax.amount.amount', 0)
        ->assertJsonPath('pendingDeclarations.amount', 99_000);
});
