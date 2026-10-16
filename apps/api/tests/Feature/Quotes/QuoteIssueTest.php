<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
    Storage::fake('local');
});

test('numbers, dates, freezes and files the quote it validates', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $id = quoteDraftFor($user, $client);

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$id}/issue")
        ->assertOk()
        ->assertJsonPath('quote.number', 'D-2026-001')
        ->assertJsonPath('quote.status', QuoteStatus::Sent->value)
        ->assertJsonPath('quote.issuedOn', '2026-08-10')
        ->assertJsonPath('quote.validUntil', '2026-09-09')
        ->assertJsonPath('content.seller.name', 'Théo Marchand')
        ->assertJsonPath('content.seller.email', 'theo@marchand.dev')
        ->assertJsonPath('content.seller.iban', null)
        ->assertJsonPath('content.buyer.name', 'Nordlys')
        ->assertJsonPath('content.buyer.addressLines', ['3 impasse des Potiers', '44100 Nantes'])
        ->assertJsonPath('document.fileName', 'Devis-D-2026-001.pdf');

    $document = Quote::query()->findOrFail($id)->attachedDocument();
    expect($document?->getCustomProperty('category'))->toBe(DocumentCategory::Quote->value);
});

test('keeps its own series, apart from the invoices\'', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    Invoice::factory()->for($user)->for($client)->create(['number' => '2026-041', 'status' => InvoiceStatus::Sent]);
    Quote::factory()->for($user)->for($client)->sent()->create(['number' => 'D-2026-007']);
    $id = quoteDraftFor($user, $client);

    $this->actingAs($user)->getJson('/api/invoicing/settings')
        ->assertJsonPath('nextInvoiceNumber', '2026-042')
        ->assertJsonPath('nextQuoteNumber', 'D-2026-008');
    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$id}/issue")
        ->assertJsonPath('quote.number', 'D-2026-008');
});

test('numbers from the format the account chose', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $user->settingsOrFail()->update(['quote_number_format' => 'DEV-AAAA-MM-NNN']);
    $id = quoteDraftFor($user, $client);

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$id}/issue")
        ->assertJsonPath('quote.number', 'DEV-2026-08-001');
});

test('leaves no gap behind a deleted draft', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $deleted = quoteDraftFor($user, $client);
    $this->actingAs($user)->deleteJson("/api/invoicing/quotes/{$deleted}")->assertNoContent();
    $id = quoteDraftFor($user, $client);

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$id}/issue")
        ->assertJsonPath('quote.number', 'D-2026-001');
});

test('refuses to validate a quote missing a mandatory mention', function (callable $arrange, string $field): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $id = quoteDraftFor($user, $client);
    $arrange($user, $client, $id);

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$id}/issue")
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor($field);

    expect(Quote::query()->findOrFail($id)->status)->toBe(QuoteStatus::Draft);
})->with([
    'no seller address' => [fn (User $user) => $user->settingsOrFail()->update(['company_address_line1' => null]), 'seller'],
    'no seller siret' => [fn (User $user) => $user->settingsOrFail()->update(['siret' => null]), 'seller'],
    'no buyer address' => [fn (User $user, $client) => $client->update(['billing_city' => null]), 'buyer'],
    'no lines' => [fn (User $user, Client $client, int $id) => test()->actingAs($user)->putJson("/api/invoicing/quotes/{$id}", quotePayloadFor($client, ['lines' => []]))->assertOk(), 'lines'],
]);

test('validates a draft once, whatever a racing request holds', function (): void {
    $user = issuableAccount();
    $id = quoteDraftFor($user, billableClient($user));

    $this->actingAs($user)->postJson("/api/invoicing/quotes/{$id}/issue")->assertOk();
    $this->actingAs($user)->postJson("/api/invoicing/quotes/{$id}/issue")->assertConflict();

    expect($user->quotes()->whereNotNull('number')->count())->toBe(1);
});
