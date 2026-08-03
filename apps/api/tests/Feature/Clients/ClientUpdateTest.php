<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;

test('updates a client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Old name', 'notes' => 'old']);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", ['name' => 'New name'])
        ->assertOk()
        ->assertJsonPath('name', 'New name')
        ->assertJsonPath('notes', null);

    $this->assertDatabaseHas('clients', ['id' => $client->id, 'name' => 'New name', 'notes' => null]);
});

test('keeps the slug when the client is renamed', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Old name']);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", ['name' => 'Completely new name'])
        ->assertOk()
        ->assertJsonPath('slug', $client->slug);
});

test('keeps its own name on update', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Catamania']);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", ['name' => 'Catamania', 'notes' => 'updated'])
        ->assertOk()
        ->assertJsonPath('name', 'Catamania')
        ->assertJsonPath('notes', 'updated');
});

test('rejects a name already used by a sibling client', function (): void {
    $user = User::factory()->create();
    Client::factory()->for($user)->create(['name' => 'Catamania']);
    $client = Client::factory()->for($user)->create(['name' => 'Studio Lorem']);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", ['name' => 'Catamania'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

test('allows a name used by another user client', function (): void {
    Client::factory()->create(['name' => 'Catamania']);

    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Studio Lorem']);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", ['name' => 'Catamania'])
        ->assertOk()
        ->assertJsonPath('name', 'Catamania');
});

test('rejects an invalid payload', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", ['name' => ''])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

test('cannot update another user client', function (): void {
    $client = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->putJson("/api/clients/{$client->id}", ['name' => 'Hijacked'])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $client = Client::factory()->create();

    $this->putJson("/api/clients/{$client->id}", ['name' => 'New name'])->assertUnauthorized();
});
