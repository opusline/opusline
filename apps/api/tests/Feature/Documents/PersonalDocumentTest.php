<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('requires authentication', function (): void {
    $this->getJson('/api/documents')->assertUnauthorized();
});

test('starts with an empty pack', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/documents')
        ->assertOk()
        ->assertJsonPath('documents', []);
});

test('files a piece against the account and reports it as personal', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/documents', [
            'file' => UploadedFile::fake()->create('kbis.pdf', 20, 'application/pdf'),
            'category' => DocumentCategory::Kbis->value,
        ])
        ->assertCreated()
        ->assertJsonPath('category', DocumentCategory::Kbis->value)
        ->assertJsonPath('source', 2);

    $this->actingAs($user)
        ->getJson('/api/documents')
        ->assertOk()
        ->assertJsonCount(1, 'documents')
        ->assertJsonPath('documents.0.fileName', 'kbis.pdf');
});

test('reclassifies a piece', function (): void {
    $user = User::factory()->create();

    $document = $this->actingAs($user)
        ->postJson('/api/documents', [
            'file' => UploadedFile::fake()->create('attestation.pdf', 20, 'application/pdf'),
            'category' => DocumentCategory::Other->value,
        ])
        ->assertCreated()
        ->json();

    $this->actingAs($user)
        ->putJson("/api/documents/{$document['id']}", [
            'category' => DocumentCategory::UrssafVigilance->value,
        ])
        ->assertOk()
        ->assertJsonPath('category', DocumentCategory::UrssafVigilance->value);
});

test('removes a piece', function (): void {
    $user = User::factory()->create();

    $document = $this->actingAs($user)
        ->postJson('/api/documents', [
            'file' => UploadedFile::fake()->create('rib.pdf', 20, 'application/pdf'),
            'category' => DocumentCategory::Rib->value,
        ])
        ->assertCreated()
        ->json();

    $this->actingAs($user)
        ->deleteJson("/api/documents/{$document['id']}")
        ->assertNoContent();

    $this->actingAs($user)
        ->getJson('/api/documents')
        ->assertOk()
        ->assertJsonPath('documents', []);
});

test('never lists another account pieces', function (): void {
    $stranger = User::factory()->create();

    $this->actingAs($stranger)
        ->postJson('/api/documents', [
            'file' => UploadedFile::fake()->create('kbis.pdf', 20, 'application/pdf'),
            'category' => DocumentCategory::Kbis->value,
        ])
        ->assertCreated();

    $this->actingAs(User::factory()->create())
        ->getJson('/api/documents')
        ->assertOk()
        ->assertJsonPath('documents', []);
});

test('hides another account piece behind a 404', function (): void {
    $stranger = User::factory()->create();

    $document = $this->actingAs($stranger)
        ->postJson('/api/documents', [
            'file' => UploadedFile::fake()->create('kbis.pdf', 20, 'application/pdf'),
            'category' => DocumentCategory::Kbis->value,
        ])
        ->assertCreated()
        ->json();

    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/documents/{$document['id']}")
        ->assertNotFound();
});

test('keeps a client document out of the personal pack', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->slug}/documents", [
            'file' => UploadedFile::fake()->create('contrat.pdf', 20, 'application/pdf'),
            'category' => DocumentCategory::Contract->value,
        ])
        ->assertCreated();

    $this->actingAs($user)
        ->getJson('/api/documents')
        ->assertOk()
        ->assertJsonPath('documents', []);
});

test('lists the administrative pack a client asks for', function (): void {
    expect(DocumentCategory::administrativePack())->toBe([
        DocumentCategory::Kbis,
        DocumentCategory::UrssafVigilance,
        DocumentCategory::Insurance,
        DocumentCategory::Rib,
    ]);
});

test('does not count a contract as an administrative piece', function (): void {
    expect(DocumentCategory::Contract->isAdministrative())->toBeFalse()
        ->and(DocumentCategory::Kbis->isAdministrative())->toBeTrue();
});
