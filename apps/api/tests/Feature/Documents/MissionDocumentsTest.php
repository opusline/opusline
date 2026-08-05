<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Documents\Enums\DocumentSource;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('uploads a document to a mission', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->post("/api/clients/{$client->slug}/missions/{$mission->slug}/documents", [
            'file' => UploadedFile::fake()->create('CRA-juillet.pdf', 88, 'application/pdf'),
            'category' => DocumentCategory::SignedCra->value,
        ])
        ->assertCreated()
        ->assertJsonPath('fileName', 'CRA-juillet.pdf')
        ->assertJsonPath('category', DocumentCategory::SignedCra->value)
        ->assertJsonPath('source', DocumentSource::Mission->value);

    $this->assertDatabaseHas('media', ['model_type' => 'mission', 'model_id' => $mission->id]);
});

test('lists mission and client documents together with their source', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->travelTo(now()->subDay());
    $this->actingAs($user)->post("/api/clients/{$client->slug}/documents", [
        'file' => UploadedFile::fake()->create('Contrat-cadre.pdf', 412, 'application/pdf'),
    ]);
    $this->travelBack();
    $this->actingAs($user)->post("/api/clients/{$client->slug}/missions/{$mission->slug}/documents", [
        'file' => UploadedFile::fake()->create('CRA-juillet.pdf', 88, 'application/pdf'),
    ]);

    $this->actingAs($user)
        ->getJson("/api/clients/{$client->slug}/missions/{$mission->slug}/documents")
        ->assertOk()
        ->assertJsonCount(2, 'documents')
        ->assertJsonPath('documents.0.fileName', 'CRA-juillet.pdf')
        ->assertJsonPath('documents.0.source', DocumentSource::Mission->value)
        ->assertJsonPath('documents.1.fileName', 'Contrat-cadre.pdf')
        ->assertJsonPath('documents.1.source', DocumentSource::Client->value);
});

test('updates the category of a mission document', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);
    $documentId = $this->actingAs($user)->post("/api/clients/{$client->slug}/missions/{$mission->slug}/documents", [
        'file' => UploadedFile::fake()->create('Devis.pdf', 50, 'application/pdf'),
    ])->json('id');

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->slug}/missions/{$mission->slug}/documents/{$documentId}", [
            'category' => DocumentCategory::Quote->value,
        ])
        ->assertOk()
        ->assertJsonPath('category', DocumentCategory::Quote->value);
});

test('downloads a mission document as an attachment', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);
    $documentId = $this->actingAs($user)->post("/api/clients/{$client->slug}/missions/{$mission->slug}/documents", [
        'file' => UploadedFile::fake()->create('CRA-juillet.pdf', 88, 'application/pdf'),
    ])->json('id');

    $response = $this->actingAs($user)
        ->get("/api/clients/{$client->slug}/missions/{$mission->slug}/documents/{$documentId}/download")
        ->assertOk();

    expect($response->headers->get('Content-Disposition'))
        ->toContain('attachment')
        ->toContain('CRA-juillet.pdf')
        ->and($response->headers->get('Cache-Control'))->toContain('no-store');
});

test('deletes a mission document', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);
    $documentId = $this->actingAs($user)->post("/api/clients/{$client->slug}/missions/{$mission->slug}/documents", [
        'file' => UploadedFile::fake()->create('CRA-juillet.pdf', 88, 'application/pdf'),
    ])->json('id');

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$client->slug}/missions/{$mission->slug}/documents/{$documentId}")
        ->assertNoContent();

    $this->assertDatabaseMissing('media', ['id' => $documentId]);
});

test('deleting the mission removes its documents', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);
    $documentId = $this->actingAs($user)->post("/api/clients/{$client->slug}/missions/{$mission->slug}/documents", [
        'file' => UploadedFile::fake()->create('CRA-juillet.pdf', 88, 'application/pdf'),
    ])->json('id');

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$client->slug}/missions/{$mission->slug}")
        ->assertNoContent();

    $this->assertDatabaseMissing('media', ['id' => $documentId]);
});

test('cannot touch a client owned document through the mission routes', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);
    $clientDocumentId = $this->actingAs($user)->post("/api/clients/{$client->slug}/documents", [
        'file' => UploadedFile::fake()->create('Contrat-cadre.pdf', 412, 'application/pdf'),
    ])->json('id');

    $missionDocumentBase = "/api/clients/{$client->slug}/missions/{$mission->slug}/documents/{$clientDocumentId}";

    $this->actingAs($user)
        ->putJson($missionDocumentBase, ['category' => DocumentCategory::Contract->value])
        ->assertNotFound();
    $this->actingAs($user)
        ->getJson("{$missionDocumentBase}/download")
        ->assertNotFound();
    $this->actingAs($user)
        ->deleteJson($missionDocumentBase)
        ->assertNotFound();

    $this->assertDatabaseHas('media', ['id' => $clientDocumentId]);
});

test('cannot reach mission documents through a sibling client of the same user', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $siblingClient = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->getJson("/api/clients/{$siblingClient->slug}/missions/{$mission->slug}/documents")
        ->assertNotFound();
});

test('cannot list or upload documents of another user mission', function (): void {
    $mission = Mission::factory()->create();

    $intruder = User::factory()->create();

    $this->actingAs($intruder)
        ->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/documents")
        ->assertNotFound();
    $this->actingAs($intruder)
        ->post("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/documents", [
            'file' => UploadedFile::fake()->create('Contrat.pdf', 100, 'application/pdf'),
        ])
        ->assertNotFound();
});

test('cannot update, download or delete a document of another user mission', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    $client = Client::factory()->for($owner)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $owner->id]);
    $documentId = $this->actingAs($owner)->post("/api/clients/{$client->slug}/missions/{$mission->slug}/documents", [
        'file' => UploadedFile::fake()->create('CRA-juillet.pdf', 88, 'application/pdf'),
    ])->json('id');

    $intruder = User::factory()->create();
    $base = "/api/clients/{$client->slug}/missions/{$mission->slug}/documents/{$documentId}";

    $this->actingAs($intruder)
        ->putJson($base, ['category' => DocumentCategory::Contract->value])
        ->assertNotFound();
    $this->actingAs($intruder)
        ->getJson("{$base}/download")
        ->assertNotFound();
    $this->actingAs($intruder)
        ->deleteJson($base)
        ->assertNotFound();

    $this->assertDatabaseHas('media', ['id' => $documentId]);
});

test('cannot reach another user document through an own mission', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    $ownerClient = Client::factory()->for($owner)->create();
    $ownerMission = Mission::factory()->for($ownerClient, 'client')->create(['user_id' => $owner->id]);
    $foreignDocumentId = $this->actingAs($owner)->post("/api/clients/{$ownerClient->slug}/missions/{$ownerMission->slug}/documents", [
        'file' => UploadedFile::fake()->create('CRA-juillet.pdf', 88, 'application/pdf'),
    ])->json('id');

    $intruder = User::factory()->create();
    $intruderClient = Client::factory()->for($intruder)->create();
    $intruderMission = Mission::factory()->for($intruderClient, 'client')->create(['user_id' => $intruder->id]);

    $this->actingAs($intruder)
        ->getJson("/api/clients/{$intruderClient->slug}/missions/{$intruderMission->slug}/documents/{$foreignDocumentId}/download")
        ->assertNotFound();
    $this->actingAs($intruder)
        ->deleteJson("/api/clients/{$intruderClient->slug}/missions/{$intruderMission->slug}/documents/{$foreignDocumentId}")
        ->assertNotFound();

    $this->assertDatabaseHas('media', ['id' => $foreignDocumentId]);
});

test('returns 401 for guests', function (): void {
    $mission = Mission::factory()->create();

    $this->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/documents")
        ->assertUnauthorized();
});
