<?php

declare(strict_types=1);

use App\Domain\Clients\Enums\VatTreatment;
use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

function invoicePayload(Client $client): array
{
    return [
        'clientId' => $client->id,
        'amountHt' => ['amount' => 100_000, 'currency' => 'EUR'],
    ];
}

test('charges the account rate to a standard client', function (): void {
    $user = User::factory()->create();
    vatLiable($user, 2000);
    $client = Client::factory()->for($user)->create(['vat_treatment' => VatTreatment::Standard]);

    $this->actingAs($user)
        ->postJson('/api/invoices', invoicePayload($client))
        ->assertCreated()
        ->assertJsonPath('invoice.vatRateBp', 2000)
        ->assertJsonPath('invoice.vatTreatment', 0)
        ->assertJsonPath('invoice.amountTtc.amount', 120_000);
});

test('charges no VAT to an EU client that reverse charges it', function (): void {
    $user = User::factory()->create();
    vatLiable($user, 2000);
    $client = Client::factory()->for($user)->create([
        'vat_treatment' => VatTreatment::EuReverseCharge,
    ]);

    $this->actingAs($user)
        ->postJson('/api/invoices', invoicePayload($client))
        ->assertCreated()
        ->assertJsonPath('invoice.vatRateBp', 0)
        ->assertJsonPath('invoice.vatTreatment', 1)
        ->assertJsonPath('invoice.amountTtc.amount', 100_000);
});

test('charges no VAT to a client outside the EU', function (): void {
    $user = User::factory()->create();
    vatLiable($user, 2000);
    $client = Client::factory()->for($user)->create([
        'vat_treatment' => VatTreatment::OutsideEu,
    ]);

    $this->actingAs($user)
        ->postJson('/api/invoices', invoicePayload($client))
        ->assertCreated()
        ->assertJsonPath('invoice.vatRateBp', 0)
        ->assertJsonPath('invoice.vatTreatment', 2)
        ->assertJsonPath('invoice.amountTtc.amount', 100_000);
});

test('still honours a rate the request states outright', function (): void {
    $user = User::factory()->create();
    vatLiable($user, 2000);
    $client = Client::factory()->for($user)->create([
        'vat_treatment' => VatTreatment::OutsideEu,
    ]);

    $this->actingAs($user)
        ->postJson('/api/invoices', [...invoicePayload($client), 'vatRateBp' => 550])
        ->assertCreated()
        ->assertJsonPath('invoice.vatRateBp', 550);
});

test('keeps the franchise en base at zero whatever the client treatment', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create([
        'vat_treatment' => VatTreatment::Standard,
    ]);

    $this->actingAs($user)
        ->postJson('/api/invoices', invoicePayload($client))
        ->assertCreated()
        ->assertJsonPath('invoice.vatRateBp', 0);
});

test('defaults a client to the standard treatment', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/clients', ['name' => 'Vesterhus', 'type' => 0])
        ->assertCreated()
        ->assertJsonPath('vatTreatment', 0);
});

test('records the treatment a client is created with', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/clients', [
            'name' => 'Vesterhus',
            'type' => 0,
            'vatTreatment' => 2,
        ])
        ->assertCreated()
        ->assertJsonPath('vatTreatment', 2);
});

test('refuses a treatment outside the enum', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/clients', ['name' => 'Vesterhus', 'type' => 0, 'vatTreatment' => 9])
        ->assertJsonValidationErrorFor('vatTreatment');
});

test('freezes the treatment an invoice was drawn up under', function (): void {
    $user = User::factory()->create();
    vatLiable($user, 2000);
    $client = Client::factory()->for($user)->create([
        'vat_treatment' => VatTreatment::OutsideEu,
    ]);

    $invoice = $this->actingAs($user)
        ->postJson('/api/invoices', invoicePayload($client))
        ->assertCreated()
        ->json();

    // Reclassifying the client must not rewrite an invoice already drawn up.
    $client->update(['vat_treatment' => VatTreatment::Standard]);

    $this->actingAs($user)
        ->getJson("/api/invoices/{$invoice['invoice']['id']}")
        ->assertOk()
        ->assertJsonPath('invoice.vatTreatment', 2)
        ->assertJsonPath('invoice.vatRateBp', 0);
});
