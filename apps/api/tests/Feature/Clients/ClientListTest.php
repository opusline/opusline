<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;

test('lists only the authenticated user clients', function (): void {
    $user = User::factory()->create();
    Client::factory()->for($user)->create(['name' => 'Alpha']);
    Client::factory()->for($user)->create(['name' => 'Beta']);
    Client::factory()->create(['name' => 'Someone else']);

    $this->actingAs($user)
        ->getJson('/api/clients')
        ->assertOk()
        ->assertJsonCount(2, 'clients')
        ->assertJsonPath('clients.0.name', 'Alpha')
        ->assertJsonPath('clients.1.name', 'Beta')
        ->assertJsonMissing(['name' => 'Someone else']);
});

test('includes archived clients with their archive timestamp', function (): void {
    $user = User::factory()->create();
    Client::factory()->for($user)->archived()->create();

    $response = $this->actingAs($user)->getJson('/api/clients')->assertOk();

    expect($response->json('clients.0.archivedAt'))->not->toBeNull();
});

test('returns 401 for guests', function (): void {
    $this->getJson('/api/clients')->assertUnauthorized();
});
