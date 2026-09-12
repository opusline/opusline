<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Models\ContributionRate;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('provisions urssaf on this month plus the unpaid previous month', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2500]);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-31');
    paidInvoiceOn($user, '2026-06-30');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        // August's accrual plus July's, carried while no payment shows; June
        // is gone — two periods behind is out of the model's sight. Each month
        // owes 1 650 € × (25 % + 0,2 % CFP) = 415,80 €.
        ->assertJsonPath('provisions.urssaf.amount.amount', 83_160)
        ->assertJsonPath('provisions.urssaf.rateBp', 2520)
        ->assertJsonPath('provisions.total.amount', 83_160);
});

test('a detected urssaf debit settles the carried month', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2500]);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-31');
    fiscDebitOn($user, '2026-08-05', 41_580, 'PRLV URSSAF JUILLET');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.amount.amount', 41_580);
});

test('a partial urssaf payment leaves the rest carried', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2500]);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-31');
    fiscDebitOn($user, '2026-08-05', 20_000, 'PRLV URSSAF JUILLET');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.amount.amount', 63_160);
});

test('an overpayment never eats into the current month', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2500]);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-31');
    fiscDebitOn($user, '2026-08-05', 60_000, 'PRLV URSSAF REGULARISATION');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.amount.amount', 41_580);
});

test('only payments inside the current period settle the carry', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2500]);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-31');
    // July's debit settled June, which the window no longer represents.
    fiscDebitOn($user, '2026-07-28', 41_580, 'PRLV URSSAF JUIN');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.amount.amount', 83_160);
});

test('provisions urssaf on the quarter plus the unpaid previous quarter', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'contribution_rate_bp' => 2500,
        'urssaf_periodicity' => UrssafPeriodicity::Quarterly,
    ]);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-31');
    paidInvoiceOn($user, '2026-06-30');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.amount.amount', 124_740);
});

test('a detected urssaf debit settles the carried quarter', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'contribution_rate_bp' => 2500,
        'urssaf_periodicity' => UrssafPeriodicity::Quarterly,
    ]);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-31');
    paidInvoiceOn($user, '2026-06-30');
    fiscDebitOn($user, '2026-07-20', 41_580, 'PRLV URSSAF T2');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.amount.amount', 83_160);
});

test('provisions the lines summed, not the base rated once', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2600, 'liberating_payment' => false]);

    paidInvoiceOn($user, '2026-08-03', htCents: 12_345, ttcCents: 14_814);

    // 3 210 of cotisations plus 25 of CFP — a single 26,2 % would give 3 234.
    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.amount.amount', 3_235);
});

test('folds the versement libératoire into the urssaf rate', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'contribution_rate_bp' => 2500,
        'liberating_payment' => true,
        'liberating_payment_rate_bp' => 220,
    ]);

    paidInvoiceOn($user, '2026-08-03');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.rateBp', 2740)
        ->assertJsonPath('provisions.urssaf.amount.amount', 45_210);
});

test('provisions the tva of this month plus the unpaid previous month under réel normal', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2500]);
    vatLiable($user);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-15');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.vat.amount.amount', 66_000)
        ->assertJsonPath('provisions.vat.rateBp', null);
});

test('a tva télérèglement settles the carried month and leaves urssaf alone', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2500]);
    vatLiable($user);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-15');
    fiscDebitOn($user, '2026-08-12', 33_000, 'TELEREGLEMENT TVA CA3 JUILLET');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.vat.amount.amount', 33_000)
        // The TVA label settles nothing on the URSSAF side.
        ->assertJsonPath('provisions.urssaf.amount.amount', 83_160)
        ->assertJsonPath('provisions.total.amount', 116_160);
});

test('provisions the tva collected since january under réel simplifié', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'contribution_rate_bp' => 2500,
        'vat_regime' => VatRegime::ReelSimplifie,
        'default_vat_rate_bp' => 2000,
    ]);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-03-15');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.vat.amount.amount', 66_000);
});

test('adds the treasury buffer verbatim', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'contribution_rate_bp' => 2500,
        'treasury_buffer_cents' => 150_000,
    ]);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.buffer.amount', 150_000)
        ->assertJsonPath('provisions.urssaf.amount.amount', 0)
        ->assertJsonPath('provisions.total.amount', 150_000);
});

test('provisions nothing for the CFE on an account with nothing to go on', function (): void {
    // No entered amount, no CFE debit on the statements, and revenue under the
    // cotisation minimum's exemption floor — so the barème has nothing to say either.
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.cfe', null);
});

test('provisions a barème guess once the account has collected enough, and says it is one', function (): void {
    $user = User::factory()->create();
    paidInvoiceOn($user, '2026-08-03', htCents: 900_000, ttcCents: 1_080_000);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        // The barème's ballpark for that bracket is 110 €; frozen in August the
        // account owes eight twelfths of it.
        ->assertJsonPath('provisions.cfe.amount.amount', 7_333)
        ->assertJsonPath('provisions.cfe.isEstimate', true);
});

test('an entered CFE is not flagged as a guess', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['cfe_expected_cents' => 48_000]);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.cfe.isEstimate', false);
});

test('provisions a twelfth of the expected CFE per elapsed month', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['cfe_expected_cents' => 48_000]);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        // Frozen in August: eight twelfths of 480 €, due on the 15th of December.
        ->assertJsonPath('provisions.cfe.amount.amount', 32_000)
        ->assertJsonPath('provisions.cfe.rateBp', null)
        ->assertJsonPath('provisions.cfe.periodEnd', '2026-12-31')
        ->assertJsonPath('provisions.total.amount', 32_000);
});

test('a detected CFE debit settles what had accrued', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['cfe_expected_cents' => 48_000]);

    fiscDebitOn($user, '2026-07-04', 20_000, 'DGFIP CFE 2026');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.cfe.amount.amount', 12_000);
});

test('a CFE overpayment never turns into a negative provision', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['cfe_expected_cents' => 48_000]);

    fiscDebitOn($user, '2026-07-04', 48_000, 'DGFIP CFE 2026');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.cfe.amount.amount', 0);
});

test('the creation year is exempt from the CFE provision', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'cfe_expected_cents' => 48_000,
        'business_started_on' => '2026-02-01',
    ]);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.cfe', null);
});

test('prices the carried month at the rate that applied when it closed', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2500]);

    // July closed under 25 %; an ACRE step ends and August runs at 12 %.
    ContributionRate::query()->create([
        'user_id' => $user->id,
        'effective_rate_bp' => 2500,
        'effective_from' => '2025-01-01',
    ]);
    ContributionRate::query()->create([
        'user_id' => $user->id,
        'effective_rate_bp' => 1200,
        'effective_from' => '2026-08-01',
    ]);
    $user->settings()->sole()->update(['contribution_rate_bp' => 1200]);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-31');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        // 165 000 HT each month: August at 12 % plus July still at 25 %.
        ->assertJsonPath('provisions.urssaf.amount.amount', 19_800 + 41_250)
        ->assertJsonPath('provisions.urssaf.rateBp', 1200);
});

test('falls back to the settings for an account that never changed its rate', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2500]);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-31');

    expect(ContributionRate::query()->where('user_id', $user->id)->count())->toBe(0);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.amount.amount', 82_500);
});

test('records what the rate was the first time it moves', function (): void {
    $user = User::factory()->create();
    $settings = $user->settings()->sole();
    $settings->update(['contribution_rate_bp' => 2500]);
    // An account with some history behind it: a rate changed on the day the
    // account opened has no earlier period to price, and writes one row.
    $settings->forceFill(['created_at' => '2025-01-01 09:00:00'])->save();

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'autoRates' => false,
            'contributionRateBp' => 1200,
        ]))
        ->assertOk();

    $recorded = ContributionRate::query()
        ->where('user_id', $user->id)
        ->orderBy('effective_from')
        ->pluck('effective_rate_bp')
        ->all();

    // The rate it was on, dated from the account's beginning, then the new one.
    expect($recorded)->toBe([2500, 1200]);
    expect(
        ContributionRate::query()
            ->where('user_id', $user->id)
            ->orderBy('effective_from')
            ->first()
            ?->effective_from
            ->toDateString(),
    )->toBe('2025-01-01');
});

test('writes nothing when a save leaves the rate alone', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2600]);

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'autoRates' => false,
            'contributionRateBp' => 2600,
        ]))
        ->assertOk();

    expect(ContributionRate::query()->where('user_id', $user->id)->count())->toBe(0);
});
