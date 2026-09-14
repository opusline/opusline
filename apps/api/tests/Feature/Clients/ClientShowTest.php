<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('shows a client with its missions ordered by name', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Nordlys']);
    Mission::factory()->for($client, 'client')->create(['user_id' => $user->id, 'name' => 'Refonte front']);
    Mission::factory()->for($client, 'client')->create(['user_id' => $user->id, 'name' => 'Audit']);

    $this->actingAs($user)
        ->getJson("/api/clients/{$client->slug}")
        ->assertOk()
        ->assertJsonPath('id', $client->id)
        ->assertJsonPath('name', 'Nordlys')
        ->assertJsonCount(2, 'missions')
        ->assertJsonPath('missions.0.name', 'Audit')
        ->assertJsonPath('missions.1.name', 'Refonte front');
});

test('says whether the client has a logo to ask for', function (bool $hasLogo): void {
    Storage::fake('local');
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    if ($hasLogo) {
        $client->addMedia(UploadedFile::fake()->image('logo.png'))->toMediaCollection('logo');
    }

    $client->addMedia(UploadedFile::fake()->create('contrat.pdf', 10, 'application/pdf'))->toMediaCollection(Client::DOCUMENT_COLLECTION);

    $this->actingAs($user)->getJson("/api/clients/{$client->slug}")->assertOk()->assertJsonPath('hasLogo', $hasLogo);
    $this->actingAs($user)->getJson('/api/clients')->assertOk()->assertJsonPath('clients.0.hasLogo', $hasLogo);
})->with(['with a logo' => [true], 'with only documents' => [false]]);

test('shows a client without missions with an empty list', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->getJson("/api/clients/{$client->slug}")
        ->assertOk()
        ->assertJsonPath('missions', []);
});

test('cannot show another user client', function (): void {
    $client = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->getJson("/api/clients/{$client->slug}")
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $client = Client::factory()->create();

    $this->getJson("/api/clients/{$client->slug}")->assertUnauthorized();
});
