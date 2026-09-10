<?php

declare(strict_types=1);

use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('files the document an issued invoice is', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'number' => 'F-2026-014',
    ]));

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/document", [
            'file' => UploadedFile::fake()->create('facture.pdf', 90, 'application/pdf'),
        ])
        ->assertCreated()
        ->assertJsonPath('document.fileName', 'F-2026-014.pdf')
        ->assertJsonPath('document.category', DocumentCategory::IssuedInvoice->value);
});

test('files it on the client, where the document library will find it', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/document", [
            'file' => UploadedFile::fake()->create('facture.pdf', 90, 'application/pdf'),
        ])
        ->assertCreated();

    $document = $invoice->client->media()->where('collection_name', 'documents')->sole();

    expect($document->getCustomProperty(Invoice::DOCUMENT_INVOICE_PROPERTY))->toBe($invoice->id);
});

test('accepts a scan of the invoice', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/document", [
            'file' => UploadedFile::fake()->image('facture.jpg'),
        ])
        ->assertCreated();
});

test('rejects a file an invoice would never be', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/document", [
            'file' => UploadedFile::fake()->create('lignes.csv', 10, 'text/csv'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['file']);
});

test('refuses a document on a draft, which was never issued', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user);

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/document", [
            'file' => UploadedFile::fake()->create('facture.pdf', 90, 'application/pdf'),
        ])
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_attach_document_unless_issued'));
});

test('replaces the filed document rather than keeping two', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    foreach (['premier.pdf', 'corrigee.pdf'] as $name) {
        $this->actingAs($user)
            ->postJson("/api/invoices/{$invoice->id}/document", [
                'file' => UploadedFile::fake()->create($name, 90, 'application/pdf'),
            ])
            ->assertCreated();
    }

    expect($invoice->client->media()->where('collection_name', 'documents')->count())->toBe(1);
});

test('reports no document until one is filed', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->getJson("/api/invoices/{$invoice->id}")
        ->assertOk()
        ->assertJsonPath('document', null);
});

test('hands the filed document back', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/document", [
            'file' => UploadedFile::fake()->createWithContent('facture.pdf', '%PDF-1.4 fake invoice'),
        ])
        ->assertCreated();

    $this->actingAs($user)
        ->get("/api/invoices/{$invoice->id}/document")
        ->assertOk()
        ->assertDownload();
});

test('answers 404 for a download when nothing was filed', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->get("/api/invoices/{$invoice->id}/document")
        ->assertNotFound();
});

test('unfiles the document', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/document", [
            'file' => UploadedFile::fake()->create('facture.pdf', 90, 'application/pdf'),
        ])
        ->assertCreated();

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}/document")
        ->assertNoContent();

    expect($invoice->client->media()->where('collection_name', 'documents')->count())->toBe(0);
});

test('answers 404 when there is nothing to unfile', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}/document")
        ->assertNotFound();
});

test('keeps the document when its category is corrected in the client fiche', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $document = $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/document", [
            'file' => UploadedFile::fake()->create('facture.pdf', 90, 'application/pdf'),
        ])
        ->assertCreated()
        ->json('document.id');

    $this->actingAs($user)
        ->putJson("/api/clients/{$invoice->client->slug}/documents/{$document}", [
            'category' => DocumentCategory::Other->value,
        ])
        ->assertOk();

    $this->actingAs($user)
        ->getJson("/api/invoices/{$invoice->id}")
        ->assertOk()
        ->assertJsonPath('document.id', $document);
});

test('cannot file a document against another user invoice', function (): void {
    $user = User::factory()->create();
    $foreign = invoiceOwnedBy(User::factory()->create(), configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$foreign->id}/document", [
            'file' => UploadedFile::fake()->create('facture.pdf', 90, 'application/pdf'),
        ])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $invoice = invoiceOwnedBy(User::factory()->create(), configure: fn ($factory) => $factory->sent());

    $this->getJson("/api/invoices/{$invoice->id}/document")->assertUnauthorized();
});
