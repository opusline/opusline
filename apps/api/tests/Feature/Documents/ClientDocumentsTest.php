<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Documents\Enums\DocumentSource;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('uploads a document with the default category', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $response = $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->createWithContent('Contrat-cadre-2025.pdf', '%PDF-1.4 fake contract'),
        ])
        ->assertCreated()
        ->assertJsonPath('fileName', 'Contrat-cadre-2025.pdf')
        ->assertJsonPath('category', DocumentCategory::Other->value)
        ->assertJsonPath('source', DocumentSource::Client->value);

    expect($response->json('sizeBytes'))->toBeGreaterThan(0)
        ->and($response->json('createdAt'))->not->toBeNull();
    $this->assertDatabaseHas('media', ['model_type' => 'client', 'model_id' => $client->id]);
});

test('uploads a document with an explicit category', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->create('Contrat.pdf', 100, 'application/pdf'),
            'category' => DocumentCategory::Contract->value,
        ])
        ->assertCreated()
        ->assertJsonPath('category', DocumentCategory::Contract->value);
});

test('rejects an unsupported file type', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->create('run.exe', 100, 'application/x-msdownload'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['file']);
});

test('rejects an oversized document', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->create('huge.pdf', 21_000, 'application/pdf'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['file']);
});

test('rejects an unknown category', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->create('Contrat.pdf', 100, 'application/pdf'),
            'category' => 99,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['category']);
});

test('lists documents newest first', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->travelTo(now()->subDay());
    $this->actingAs($user)->post("/api/clients/{$client->slug}/documents", [
        'file' => UploadedFile::fake()->create('older.pdf', 100, 'application/pdf'),
    ]);
    $this->travelBack();
    $this->actingAs($user)->post("/api/clients/{$client->slug}/documents", [
        'file' => UploadedFile::fake()->create('newer.pdf', 100, 'application/pdf'),
    ]);

    $this->actingAs($user)
        ->getJson("/api/clients/{$client->slug}/documents")
        ->assertOk()
        ->assertJsonCount(2, 'documents')
        ->assertJsonPath('documents.0.fileName', 'newer.pdf')
        ->assertJsonPath('documents.1.fileName', 'older.pdf');
});

test('updates the category of a document', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $documentId = $this->actingAs($user)->post("/api/clients/{$client->slug}/documents", [
        'file' => UploadedFile::fake()->create('Facture.pdf', 74, 'application/pdf'),
    ])->json('id');

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->slug}/documents/{$documentId}", [
            'category' => DocumentCategory::ReceivedInvoice->value,
        ])
        ->assertOk()
        ->assertJsonPath('category', DocumentCategory::ReceivedInvoice->value);
});

test('downloads a document as an attachment', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $documentId = $this->actingAs($user)->post("/api/clients/{$client->slug}/documents", [
        'file' => UploadedFile::fake()->create('Contrat.pdf', 100, 'application/pdf'),
    ])->json('id');

    $response = $this->actingAs($user)
        ->get("/api/clients/{$client->slug}/documents/{$documentId}/download")
        ->assertOk();

    expect($response->headers->get('Content-Disposition'))
        ->toContain('attachment')
        ->toContain('Contrat.pdf')
        ->and($response->headers->get('Cache-Control'))->toContain('no-store');
});

test('deletes a document', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $documentId = $this->actingAs($user)->post("/api/clients/{$client->slug}/documents", [
        'file' => UploadedFile::fake()->create('Contrat.pdf', 100, 'application/pdf'),
    ])->json('id');

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$client->slug}/documents/{$documentId}")
        ->assertNoContent();

    $this->assertDatabaseMissing('media', ['id' => $documentId]);
});

test('deleting the client removes its documents', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $documentId = $this->actingAs($user)->post("/api/clients/{$client->slug}/documents", [
        'file' => UploadedFile::fake()->create('Contrat.pdf', 100, 'application/pdf'),
    ])->json('id');

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$client->slug}")
        ->assertNoContent();

    $this->assertDatabaseMissing('media', ['id' => $documentId]);
});

test('cannot list documents of another user client', function (): void {
    $client = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->getJson("/api/clients/{$client->slug}/documents")
        ->assertNotFound();
});

test('cannot upload a document to another user client', function (): void {
    $client = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->create('Contrat.pdf', 100, 'application/pdf'),
        ])
        ->assertNotFound();
});

test('cannot update, download or delete a document of another user client', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    $client = Client::factory()->for($owner)->create();
    $documentId = $this->actingAs($owner)->post("/api/clients/{$client->slug}/documents", [
        'file' => UploadedFile::fake()->create('Contrat.pdf', 100, 'application/pdf'),
    ])->json('id');

    $intruder = User::factory()->create();

    $this->actingAs($intruder)
        ->putJson("/api/clients/{$client->slug}/documents/{$documentId}", [
            'category' => DocumentCategory::Contract->value,
        ])
        ->assertNotFound();
    $this->actingAs($intruder)
        ->getJson("/api/clients/{$client->slug}/documents/{$documentId}/download")
        ->assertNotFound();
    $this->actingAs($intruder)
        ->deleteJson("/api/clients/{$client->slug}/documents/{$documentId}")
        ->assertNotFound();

    $this->assertDatabaseHas('media', ['id' => $documentId]);
});

test('cannot reach another user document through an own client', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    $ownerClient = Client::factory()->for($owner)->create();
    $foreignDocumentId = $this->actingAs($owner)->post("/api/clients/{$ownerClient->slug}/documents", [
        'file' => UploadedFile::fake()->create('Contrat.pdf', 100, 'application/pdf'),
    ])->json('id');

    $intruder = User::factory()->create();
    $intruderClient = Client::factory()->for($intruder)->create();

    $this->actingAs($intruder)
        ->getJson("/api/clients/{$intruderClient->slug}/documents/{$foreignDocumentId}/download")
        ->assertNotFound();
    $this->actingAs($intruder)
        ->deleteJson("/api/clients/{$intruderClient->slug}/documents/{$foreignDocumentId}")
        ->assertNotFound();

    $this->assertDatabaseHas('media', ['id' => $foreignDocumentId]);
});

test('cannot reach a document through a sibling client of the same user', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $siblingClient = Client::factory()->for($user)->create();
    $documentId = $this->actingAs($user)->post("/api/clients/{$client->slug}/documents", [
        'file' => UploadedFile::fake()->create('Contrat.pdf', 100, 'application/pdf'),
    ])->json('id');

    $this->actingAs($user)
        ->getJson("/api/clients/{$siblingClient->slug}/documents/{$documentId}/download")
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $client = Client::factory()->create();

    $this->getJson("/api/clients/{$client->slug}/documents")->assertUnauthorized();
});

test('uploads a document under a chosen name', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->create('scan001.pdf', 12, 'application/pdf'),
            'fileName' => 'Contrat Nordlys 2026',
        ])
        ->assertCreated()
        ->assertJsonPath('fileName', 'Contrat-Nordlys-2026.pdf');
});

test('keeps the uploaded extension when the chosen name carries another one', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->create('scan001.pdf', 12, 'application/pdf'),
            'fileName' => 'payload.php',
        ])
        ->assertCreated()
        ->assertJsonPath('fileName', 'payload.pdf');
});

test('clips a chosen name so the stored file name fits its column', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $response = $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->create('scan.pdf', 12, 'application/pdf'),
            'fileName' => str_repeat('a', 255),
        ])
        ->assertCreated();

    expect(mb_strlen($response->json('fileName')))->toBeLessThanOrEqual(255);
});

test('clips an overlong original file name to fit its column', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $response = $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->create(
                str_repeat('n', 300).'.pdf',
                12,
                'application/pdf',
            ),
        ])
        ->assertCreated();

    expect(mb_strlen((string) $response->json('fileName')))->toBeLessThanOrEqual(255)
        ->and($response->json('fileName'))->toEndWith('.pdf');
});

test('clips an absurd extension instead of losing the whole name', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $response = $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->create(
                'scan.'.str_repeat('e', 300),
                12,
                'application/pdf',
            ),
            'fileName' => 'Contrat',
        ])
        ->assertCreated();

    expect(mb_strlen((string) $response->json('fileName')))->toBeLessThanOrEqual(255)
        ->and($response->json('fileName'))->toStartWith('Contrat');
});

test('leaves no trailing dot when the upload has no extension', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->create('scan', 12, 'application/pdf'),
            'fileName' => 'Contrat Nordlys',
        ])
        ->assertCreated()
        ->assertJsonPath('fileName', 'Contrat-Nordlys');
});
