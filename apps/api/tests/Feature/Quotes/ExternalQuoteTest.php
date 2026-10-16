<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Invoices\Enums\InvoiceSource;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Enums\QuoteBilling;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
    Storage::fake('local');
});

function externalQuotePayload(Client $client, array $overrides = []): array
{
    return [
        'clientId' => $client->id,
        'title' => 'Refonte du back-office',
        'number' => 'DEV-118',
        'amountHt' => ['amount' => 480_000, 'currency' => 'EUR'],
        'issuedOn' => '2026-08-03',
        'status' => QuoteStatus::Sent->value,
        ...$overrides,
    ];
}

function recordExternalQuote(User $user, array $payload): TestResponse
{
    return test()->actingAs($user)->postJson('/api/invoicing/quotes/external', $payload);
}

function externalQuoteOwnedBy(User $user, array $attributes = []): Quote
{
    return Quote::factory()->for($user)->for(Client::factory()->for($user)->create())->external()->create($attributes);
}

test('records a quote issued elsewhere with its own reference and the account VAT rate', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    recordExternalQuote($user, externalQuotePayload($client))
        ->assertCreated()
        ->assertJsonPath('quote.source', InvoiceSource::External->value)
        ->assertJsonPath('quote.number', 'DEV-118')
        ->assertJsonPath('quote.status', QuoteStatus::Sent->value)
        ->assertJsonPath('quote.title', 'Refonte du back-office')
        ->assertJsonPath('quote.issuedOn', '2026-08-03')
        ->assertJsonPath('quote.validUntil', '2026-09-02')
        ->assertJsonPath('quote.amountHt.amount', 480_000)
        ->assertJsonPath('quote.amountTtc.amount', 576_000)
        ->assertJsonPath('quote.vatRateBp', 2000)
        ->assertJsonPath('quote.depositRateBp', null)
        ->assertJsonCount(0, 'content.lines')
        ->assertJsonPath('document', null)
        ->assertJsonPath('billing.canInvoiceFull', false);
});

test('records an accepted quote with the day it was accepted', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    recordExternalQuote($user, externalQuotePayload($client, ['status' => QuoteStatus::Accepted->value, 'decidedOn' => '2026-08-07']))
        ->assertCreated()
        ->assertJsonPath('quote.status', QuoteStatus::Accepted->value)
        ->assertJsonPath('quote.acceptedOn', '2026-08-07')
        ->assertJsonPath('quote.refusedOn', null)
        ->assertJsonPath('billing.canInvoiceFull', true)
        ->assertJsonPath('billing.canInvoiceDeposit', false);
});

test('dates a refusal today when no day is given', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    recordExternalQuote($user, externalQuotePayload($client, ['status' => QuoteStatus::Refused->value]))
        ->assertCreated()
        ->assertJsonPath('quote.status', QuoteStatus::Refused->value)
        ->assertJsonPath('quote.refusedOn', '2026-08-10');
});

test('takes the VAT rate it is given over the account default', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    recordExternalQuote($user, externalQuotePayload($client, ['vatRateBp' => 1000]))
        ->assertCreated()
        ->assertJsonPath('quote.vatRateBp', 1000)
        ->assertJsonPath('quote.amountTtc.amount', 528_000);
});

test('rejects what a quote the client already holds cannot be', function (array $overrides, string $field): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    recordExternalQuote($user, externalQuotePayload($client, $overrides))
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$field]);
})->with([
    'a draft' => [['status' => QuoteStatus::Draft->value], 'status'],
    'no reference' => [['number' => ''], 'number'],
    'a future issue date' => [['issuedOn' => '2026-08-11'], 'issuedOn'],
    'an answer before the quote' => [['status' => QuoteStatus::Accepted->value, 'decidedOn' => '2026-08-02'], 'decidedOn'],
    'a client of another account' => [['clientId' => 999_999], 'clientId'],
]);

test('refuses a reference another quote of the account already carries', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();
    Quote::factory()->for($user)->for($client)->sent()->create(['number' => 'D-2026-004']);

    recordExternalQuote($user, externalQuotePayload($client, ['number' => 'D-2026-004']))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['number']);
});

test('refuses a mission that belongs to another client', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();
    $otherClientMission = missionOwnedBy($user);

    recordExternalQuote($user, externalQuotePayload($client, ['missionId' => $otherClientMission->id]))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['missionId']);
});

test('has no sheet of its own: the paper and the rendered PDF are not found', function (): void {
    $user = vatLiableUser();
    $quote = externalQuoteOwnedBy($user);

    $this->actingAs($user)->getJson("/api/invoicing/quotes/{$quote->id}/paper")->assertNotFound();
    $this->actingAs($user)->get("/api/invoicing/quotes/{$quote->id}/pdf")->assertNotFound();
});

test('cannot be edited as a draft, since the client already holds it', function (): void {
    $user = vatLiableUser();
    $quote = externalQuoteOwnedBy($user);

    $this->actingAs($user)
        ->putJson("/api/invoicing/quotes/{$quote->id}", quotePayloadFor($quote->client))
        ->assertConflict();
    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/issue")
        ->assertConflict();
});

test('follows the client\'s answer like any sent quote', function (): void {
    $user = vatLiableUser();
    $quote = externalQuoteOwnedBy($user, ['issued_on' => '2026-08-01', 'valid_until' => '2026-08-31']);

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/accept")
        ->assertOk()
        ->assertJsonPath('quote.status', QuoteStatus::Accepted->value)
        ->assertJsonPath('billing.canInvoiceFull', true);
});

test('files the PDF the other tool produced under the client\'s documents', function (): void {
    $user = vatLiableUser();
    $quote = externalQuoteOwnedBy($user, ['number' => 'DEV-118']);

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/document", [
            'file' => UploadedFile::fake()->create('devis.pdf', 90, 'application/pdf'),
        ])
        ->assertCreated()
        ->assertJsonPath('document.fileName', 'DEV-118.pdf')
        ->assertJsonPath('document.category', DocumentCategory::Quote->value);

    $document = $quote->client->media()->where('collection_name', 'documents')->sole();

    expect($document->getCustomProperty(Quote::DOCUMENT_QUOTE_PROPERTY))->toBe($quote->id);
});

test('serves the filed PDF as the quote\'s PDF', function (): void {
    $user = vatLiableUser();
    $quote = externalQuoteOwnedBy($user, ['number' => 'DEV-118']);
    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/document", [
            'file' => UploadedFile::fake()->createWithContent('devis.pdf', '%PDF-1.4 the other tool'),
        ])
        ->assertCreated();

    $response = $this->actingAs($user)->get("/api/invoicing/quotes/{$quote->id}/pdf")->assertOk();

    expect($response->streamedContent())->toBe('%PDF-1.4 the other tool');
});

test('replaces the filed PDF rather than keeping two', function (): void {
    $user = vatLiableUser();
    $quote = externalQuoteOwnedBy($user);

    foreach (['un.pdf', 'deux.pdf'] as $fileName) {
        $this->actingAs($user)
            ->postJson("/api/invoicing/quotes/{$quote->id}/document", [
                'file' => UploadedFile::fake()->create($fileName, 90, 'application/pdf'),
            ])
            ->assertCreated();
    }

    expect($quote->client->media()->where('collection_name', 'documents')->count())->toBe(1);
});

test('removes the filed PDF', function (): void {
    $user = vatLiableUser();
    $quote = externalQuoteOwnedBy($user);
    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/document", [
            'file' => UploadedFile::fake()->create('devis.pdf', 90, 'application/pdf'),
        ])
        ->assertCreated();

    $this->actingAs($user)->deleteJson("/api/invoicing/quotes/{$quote->id}/document")->assertNoContent();

    expect($quote->client->media()->where('collection_name', 'documents')->count())->toBe(0);
    $this->actingAs($user)->deleteJson("/api/invoicing/quotes/{$quote->id}/document")->assertNotFound();
});

test('keeps the PDF Opusline rendered: a quote written here takes no other', function (): void {
    $user = issuableAccount();
    $quoteId = quoteDraftFor($user, billableClient($user));
    $this->actingAs($user)->postJson("/api/invoicing/quotes/{$quoteId}/issue")->assertOk();

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quoteId}/document", [
            'file' => UploadedFile::fake()->create('devis.pdf', 90, 'application/pdf'),
        ])
        ->assertConflict()
        ->assertJsonPath('message', __('quotes.document_is_opuslines'));
    $this->actingAs($user)->deleteJson("/api/invoicing/quotes/{$quoteId}/document")->assertConflict();
});

test('keeps another account\'s quote out of reach', function (): void {
    $user = vatLiableUser();
    $quote = externalQuoteOwnedBy(vatLiableUser());

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quote->id}/document", [
            'file' => UploadedFile::fake()->create('devis.pdf', 90, 'application/pdf'),
        ])
        ->assertNotFound();
    $this->actingAs($user)->deleteJson("/api/invoicing/quotes/{$quote->id}/document")->assertNotFound();
});

test('invoices an accepted external quote as one flat line at its own figure', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $quoteId = recordExternalQuote($user, externalQuotePayload($client, ['status' => QuoteStatus::Accepted->value]))
        ->assertCreated()
        ->json('quote.id');

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quoteId}/invoices", ['billing' => QuoteBilling::Full->value])
        ->assertCreated()
        ->assertJsonPath('quote.quoteId', $quoteId)
        ->assertJsonPath('quote.number', 'DEV-118')
        ->assertJsonCount(1, 'content.lines')
        ->assertJsonPath('content.lines.0.label', 'Refonte du back-office')
        ->assertJsonPath('content.lines.0.unit', LineUnit::Flat->value)
        ->assertJsonPath('content.lines.0.quantityMilli', 1000)
        ->assertJsonPath('content.lines.0.unitPrice.amount', 480_000)
        ->assertJsonPath('content.lines.0.vatRateBp', 2000)
        ->assertJsonPath('invoice.amountHt.amount', 480_000)
        ->assertJsonPath('invoice.amountTtc.amount', 576_000);
});

test('offers no deposit on an external quote, which asked for none', function (): void {
    $user = issuableAccount();
    $quoteId = recordExternalQuote($user, externalQuotePayload(billableClient($user), ['status' => QuoteStatus::Accepted->value]))
        ->assertCreated()
        ->json('quote.id');

    $this->actingAs($user)
        ->postJson("/api/invoicing/quotes/{$quoteId}/invoices", ['billing' => QuoteBilling::Deposit->value])
        ->assertConflict();
});
