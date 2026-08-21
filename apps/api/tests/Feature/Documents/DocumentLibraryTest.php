<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Documents\Enums\DocumentSource;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Color;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('groups documents by the fiche they hang on', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Nordlys', 'color' => Color::Sage]);
    $mission = Mission::factory()->for($client, 'client')->create([
        'user_id' => $user->id,
        'name' => 'Refonte portail',
        'color' => Color::Plum,
    ]);

    uploadClientDocument($user, $client, 'Contrat-cadre.pdf');
    uploadMissionDocument($user, $client, $mission, 'Devis-refonte.pdf');
    uploadMissionDocument($user, $client, $mission, 'CRA-signe.pdf');

    $response = $this->actingAs($user)->getJson('/api/documents')->assertOk();

    $response
        ->assertJsonCount(2, 'groups')
        ->assertJsonPath('groups.0.name', 'Refonte portail')
        ->assertJsonPath('groups.0.color', Color::Plum->value)
        ->assertJsonPath('groups.0.clientName', 'Nordlys')
        ->assertJsonPath('groups.0.clientSlug', $client->slug)
        ->assertJsonPath('groups.0.missionSlug', $mission->slug)
        ->assertJsonCount(2, 'groups.0.documents')
        ->assertJsonPath('groups.0.documents.0.source', DocumentSource::Mission->value)
        ->assertJsonPath('groups.1.name', 'Nordlys')
        ->assertJsonPath('groups.1.color', Color::Sage->value)
        ->assertJsonPath('groups.1.missionSlug', null)
        ->assertJsonCount(1, 'groups.1.documents')
        ->assertJsonPath('groups.1.documents.0.fileName', 'Contrat-cadre.pdf')
        ->assertJsonPath('groups.1.documents.0.source', DocumentSource::Client->value);
});

test('does not repeat a client document under its missions', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    uploadClientDocument($user, $client, 'Contrat-cadre.pdf');
    uploadMissionDocument($user, $client, $mission, 'Devis.pdf');

    $this->actingAs($user)
        ->getJson("/api/clients/{$client->slug}/missions/{$mission->slug}/documents")
        ->assertJsonCount(2, 'documents');

    $groups = $this->actingAs($user)->getJson('/api/documents')->assertOk()->json('groups');

    expect(collect($groups)->flatMap(fn (array $group): array => $group['documents'])->pluck('fileName')->all())
        ->toEqualCanonicalizing(['Contrat-cadre.pdf', 'Devis.pdf']);
});

test('falls back to the client colour for a mission without one', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['color' => Color::Indigo]);
    $mission = Mission::factory()->for($client, 'client')->create([
        'user_id' => $user->id,
        'color' => null,
    ]);

    uploadMissionDocument($user, $client, $mission, 'Devis.pdf');

    $this->actingAs($user)
        ->getJson('/api/documents')
        ->assertOk()
        ->assertJsonPath('groups.0.color', Color::Indigo->value);
});

test('orders documents newest first and groups by size then name', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $busy = Client::factory()->for($user)->create(['name' => 'Vesterhus']);
    $quietB = Client::factory()->for($user)->create(['name' => 'Orvella']);
    $quietA = Client::factory()->for($user)->create(['name' => 'Callisto']);

    $this->travelTo(now()->subDay());
    uploadClientDocument($user, $busy, 'Ancien.pdf');
    $this->travelBack();
    uploadClientDocument($user, $busy, 'Recent.pdf');
    uploadClientDocument($user, $quietB, 'Orvella.pdf');
    uploadClientDocument($user, $quietA, 'Callisto.pdf');

    $this->actingAs($user)
        ->getJson('/api/documents')
        ->assertOk()
        ->assertJsonCount(3, 'groups')
        ->assertJsonPath('groups.0.name', 'Vesterhus')
        ->assertJsonPath('groups.0.documents.0.fileName', 'Recent.pdf')
        ->assertJsonPath('groups.0.documents.1.fileName', 'Ancien.pdf')
        ->assertJsonPath('groups.1.name', 'Callisto')
        ->assertJsonPath('groups.2.name', 'Orvella');
});

test('reports the date of the newest document in the group', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->travelTo(now()->subDays(3));
    uploadClientDocument($user, $client, 'Ancien.pdf');
    $this->travelBack();
    uploadClientDocument($user, $client, 'Recent.pdf');

    $group = $this->actingAs($user)->getJson('/api/documents')->json('groups.0');

    expect($group['lastAddedAt'])->toBe($group['documents'][0]['createdAt']);
});

test('omits owners without documents', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    Client::factory()->for($user)->create();
    $withDocument = Client::factory()->for($user)->create();
    uploadClientDocument($user, $withDocument, 'Contrat.pdf');

    $this->actingAs($user)
        ->getJson('/api/documents')
        ->assertOk()
        ->assertJsonCount(1, 'groups');
});

test('includes the CRA Opusline generated', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)->post("/api/clients/{$client->slug}/missions/{$mission->slug}/documents", [
        'file' => UploadedFile::fake()->create('CRA-juillet.pdf', 88, 'application/pdf'),
        'category' => DocumentCategory::SignedCra->value,
    ]);

    $this->actingAs($user)
        ->getJson('/api/documents')
        ->assertOk()
        ->assertJsonPath('groups.0.documents.0.category', DocumentCategory::SignedCra->value);
});

test('never leaks another user documents', function (): void {
    Storage::fake('local');
    $owner = User::factory()->create();
    $client = Client::factory()->for($owner)->create();
    uploadClientDocument($owner, $client, 'Contrat.pdf');

    $this->actingAs(User::factory()->create())
        ->getJson('/api/documents')
        ->assertOk()
        ->assertJsonCount(0, 'groups');
});

test('does not list the user own administrative pieces', function (): void {
    Storage::fake('local');
    $user = User::factory()->create();
    uploadUserDocument($user, 'Kbis.pdf');

    $this->actingAs($user)
        ->getJson('/api/documents')
        ->assertOk()
        ->assertJsonCount(0, 'groups');
});

test('returns 401 for guests', function (): void {
    $this->getJson('/api/documents')->assertUnauthorized();
});
