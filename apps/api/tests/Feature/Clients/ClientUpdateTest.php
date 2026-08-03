<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;

test('updates a client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Old name', 'notes' => 'old']);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->slug}", ['name' => 'New name'])
        ->assertOk()
        ->assertJsonPath('name', 'New name')
        ->assertJsonPath('notes', null);

    $this->assertDatabaseHas('clients', ['id' => $client->id, 'name' => 'New name', 'notes' => null]);
});

test('keeps the slug when the client is renamed', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Old name']);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->slug}", ['name' => 'Completely new name'])
        ->assertOk()
        ->assertJsonPath('slug', $client->slug);
});

test('rejects an invalid payload', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->slug}", ['name' => ''])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

test('cannot update another user client', function (): void {
    $client = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->putJson("/api/clients/{$client->slug}", ['name' => 'Hijacked'])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $client = Client::factory()->create();

    $this->putJson("/api/clients/{$client->slug}", ['name' => 'New name'])->assertUnauthorized();
});
