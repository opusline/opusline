<?php

declare(strict_types=1);

use App\Domain\Invoices\Factories\InvoiceFactory;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('declares the previous month collections for a monthly account', function (): void {
    $user = User::factory()->create();

    paidInvoiceOn($user, '2026-07-10');
    // August is the running period — it belongs to the next declaration.
    paidInvoiceOn($user, '2026-08-03');

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('urssaf.period', '2026-07')
        ->assertJsonPath('urssaf.periodicity', UrssafPeriodicity::Monthly->value)
        ->assertJsonPath('urssaf.base.amount', 165_000);
});

test('declares the previous quarter for a quarterly account', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['urssaf_periodicity' => UrssafPeriodicity::Quarterly]);

    paidInvoiceOn($user, '2026-05-12');
    paidInvoiceOn($user, '2026-06-30');
    paidInvoiceOn($user, '2026-07-10');

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('urssaf.period', '2026-Q2')
        ->assertJsonPath('urssaf.periodicity', UrssafPeriodicity::Quarterly->value)
        ->assertJsonPath('urssaf.base.amount', 330_000);
});

test('a quiet period still returns its zeros because a zero month must be declared', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('urssaf.period', '2026-07')
        ->assertJsonPath('urssaf.base.amount', 0);
});

test('sums the previous month sales and collected vat under reel normal', function (): void {
    $user = User::factory()->create();
    vatLiable($user);

    paidInvoiceOn($user, '2026-07-10');
    paidInvoiceOn($user, '2026-07-22', htCents: 100_000, ttcCents: 120_000);
    paidInvoiceOn($user, '2026-08-03');

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('vat.period', '2026-07')
        ->assertJsonPath('vat.regime', VatRegime::ReelNormal->value)
        ->assertJsonPath('vat.salesHt.amount', 265_000)
        ->assertJsonPath('vat.collected.amount', 53_000)
        ->assertJsonPath('vat.rateBp', 2000);
});

test('captions no single rate once the month mixes vat rates', function (): void {
    $user = User::factory()->create();
    vatLiable($user);

    paidInvoiceOn($user, '2026-07-10');
    invoiceOwnedBy($user, configure: fn (InvoiceFactory $factory): InvoiceFactory => $factory->paid()->state([
        'issued_on' => '2026-06-20',
        'due_on' => '2026-07-20',
        'paid_on' => '2026-07-22',
        'currency' => 'EUR',
        'amount_ht_cents' => 100_000,
        'amount_ttc_cents' => 105_500,
        'vat_rate_bp' => 550,
    ]));

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('vat.rateBp', null);
});

test('an empty month reads as the account default rate', function (): void {
    $user = User::factory()->create();
    vatLiable($user, rateBp: 1000);

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('vat.salesHt.amount', 0)
        ->assertJsonPath('vat.collected.amount', 0)
        ->assertJsonPath('vat.rateBp', 1000);
});

test('offers no vat block under the franchise en base', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('vat', null);
});

test('offers no vat block under reel simplifie whose ca12 is annual', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['vat_regime' => VatRegime::ReelSimplifie]);

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('vat', null);
});

test('offers nothing outside french fiscality', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'BE']);

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('urssaf', null)
        ->assertJsonPath('vat', null);
});

test('never counts another account collections', function (): void {
    $user = User::factory()->create();
    vatLiable($user);
    $other = User::factory()->create();
    vatLiable($other);

    paidInvoiceOn($user, '2026-07-10');
    paidInvoiceOn($other, '2026-07-12');
    paidInvoiceOn($other, '2026-07-20');

    $this->actingAs($user)
        ->getJson('/api/declarations')
        ->assertOk()
        ->assertJsonPath('urssaf.base.amount', 165_000)
        ->assertJsonPath('vat.salesHt.amount', 165_000);
});

test('requires authentication', function (): void {
    $this->getJson('/api/declarations')->assertUnauthorized();
});
