<?php

declare(strict_types=1);

use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Documents\Enums\DocumentSource;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('uploads an administrative piece to the user', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/api/user/documents', [
            'file' => UploadedFile::fake()->create('Attestation-vigilance.pdf', 96, 'application/pdf'),
            'category' => DocumentCategory::Certificate->value,
        ])
        ->assertCreated()
        ->assertJsonPath('fileName', 'Attestation-vigilance.pdf')
        ->assertJsonPath('category', DocumentCategory::Certificate->value)
        ->assertJsonPath('source', DocumentSource::User->value);

    $this->assertDatabaseHas('media', ['model_type' => 'user', 'model_id' => $user->id]);
});

test('accepts every personal category', function (DocumentCategory $category): void {
    Storage::fake('local');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/api/user/documents', [
            'file' => UploadedFile::fake()->create('Piece.pdf', 12, 'application/pdf'),
            'category' => $category->value,
        ])
        ->assertCreated()
        ->assertJsonPath('category', $category->value);
})->with([
    DocumentCategory::Kbis,
    DocumentCategory::Certificate,
    DocumentCategory::Insurance,
    DocumentCategory::BankDetails,
    DocumentCategory::TermsOfSale,
    DocumentCategory::Other,
]);

test('lists the user documents newest first', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();

    $this->travelTo(now()->subDay());
    uploadUserDocument($user, 'RIB.pdf');
    $this->travelBack();
    uploadUserDocument($user, 'CGV-2026.pdf');

    $this->actingAs($user)
        ->getJson('/api/user/documents')
        ->assertOk()
        ->assertJsonCount(2, 'documents')
        ->assertJsonPath('documents.0.fileName', 'CGV-2026.pdf')
        ->assertJsonPath('documents.1.fileName', 'RIB.pdf')
        ->assertJsonPath('documents.0.source', DocumentSource::User->value);
});

test('does not list the signature among the user documents', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();

    $this->actingAs($user)->post('/api/user/signature', [
        'signature' => UploadedFile::fake()->image('signature.png'),
    ]);

    $this->actingAs($user)
        ->getJson('/api/user/documents')
        ->assertOk()
        ->assertJsonCount(0, 'documents');
});

test('updates the category of a user document', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $documentId = uploadUserDocument($user, 'Piece.pdf');

    $this->actingAs($user)
        ->putJson("/api/user/documents/{$documentId}", [
            'category' => DocumentCategory::Kbis->value,
        ])
        ->assertOk()
        ->assertJsonPath('category', DocumentCategory::Kbis->value);
});

test('downloads a user document as an attachment', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $documentId = uploadUserDocument($user, 'RIB.pdf');

    $response = $this->actingAs($user)
        ->get("/api/user/documents/{$documentId}/download")
        ->assertOk();

    expect($response->headers->get('Content-Disposition'))
        ->toContain('attachment')
        ->toContain('RIB.pdf')
        ->and($response->headers->get('Cache-Control'))->toContain('no-store');
});

test('deletes a user document', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $documentId = uploadUserDocument($user, 'RIB.pdf');

    $this->actingAs($user)
        ->deleteJson("/api/user/documents/{$documentId}")
        ->assertNoContent();

    $this->assertDatabaseMissing('media', ['id' => $documentId]);
});

test('rejects an unsupported file type', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/user/documents', [
            'file' => UploadedFile::fake()->create('script.exe', 10, 'application/octet-stream'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('file');
});

test('rejects a file over the size limit', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/user/documents', [
            'file' => UploadedFile::fake()->create('Enorme.pdf', 20481, 'application/pdf'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('file');
});

test('cannot update, download or delete another user document', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    $documentId = uploadUserDocument($owner, 'Kbis.pdf');

    $intruder = User::factory()->create();

    $this->actingAs($intruder)
        ->putJson("/api/user/documents/{$documentId}", ['category' => DocumentCategory::Other->value])
        ->assertNotFound();
    $this->actingAs($intruder)
        ->getJson("/api/user/documents/{$documentId}/download")
        ->assertNotFound();
    $this->actingAs($intruder)
        ->deleteJson("/api/user/documents/{$documentId}")
        ->assertNotFound();

    $this->assertDatabaseHas('media', ['id' => $documentId]);
});

test('does not list another user documents', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    uploadUserDocument($owner, 'Kbis.pdf');

    $this->actingAs(User::factory()->create())
        ->getJson('/api/user/documents')
        ->assertOk()
        ->assertJsonCount(0, 'documents');
});

test('returns 401 for guests', function (): void {
    $this->getJson('/api/user/documents')->assertUnauthorized();
});
