<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
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
        // is gone — two periods behind is out of the model's sight.
        ->assertJsonPath('provisions.urssaf.amount.amount', 82_500)
        ->assertJsonPath('provisions.urssaf.rateBp', 2500)
        ->assertJsonPath('provisions.total.amount', 82_500);
});

test('a detected urssaf debit settles the carried month', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2500]);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-31');
    fiscDebitOn($user, '2026-08-05', 41_250, 'PRLV URSSAF JUILLET');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.amount.amount', 41_250);
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
        ->assertJsonPath('provisions.urssaf.amount.amount', 62_500);
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
        ->assertJsonPath('provisions.urssaf.amount.amount', 41_250);
});

test('only payments inside the current period settle the carry', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2500]);

    paidInvoiceOn($user, '2026-08-03');
    paidInvoiceOn($user, '2026-07-31');
    // July's debit settled June, which the window no longer represents.
    fiscDebitOn($user, '2026-07-28', 41_250, 'PRLV URSSAF JUIN');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.amount.amount', 82_500);
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
        ->assertJsonPath('provisions.urssaf.amount.amount', 123_750);
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
    fiscDebitOn($user, '2026-07-20', 41_250, 'PRLV URSSAF T2');

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('provisions.urssaf.amount.amount', 82_500);
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
        ->assertJsonPath('provisions.urssaf.rateBp', 2720)
        ->assertJsonPath('provisions.urssaf.amount.amount', 44_880);
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
        ->assertJsonPath('provisions.urssaf.amount.amount', 82_500)
        ->assertJsonPath('provisions.total.amount', 115_500);
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
