<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

test('lists only the authenticated user clients with their missions', function (): void {
    $user = User::factory()->create();
    $alpha = Client::factory()->for($user)->create(['name' => 'Alpha']);
    Client::factory()->for($user)->create(['name' => 'Beta']);
    Mission::factory()->for($alpha, 'client')->create(['user_id' => $user->id, 'name' => 'Refonte front']);
    Client::factory()->create(['name' => 'Someone else']);

    $this->actingAs($user)
        ->getJson('/api/clients')
        ->assertOk()
        ->assertJsonCount(2, 'clients')
        ->assertJsonPath('clients.0.name', 'Alpha')
        ->assertJsonPath('clients.1.name', 'Beta')
        ->assertJsonPath('clients.0.missions.0.name', 'Refonte front')
        ->assertJsonMissing(['name' => 'Someone else']);
});

test('serializes the mission rate as a money object', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    Mission::factory()->for($client, 'client')->create([
        'user_id' => $user->id,
        'rate_cents' => 55_000,
    ]);

    $this->actingAs($user)
        ->getJson('/api/clients')
        ->assertOk()
        ->assertJsonPath('clients.0.missions.0.rate.amount', 55_000)
        ->assertJsonPath('clients.0.missions.0.rate.currency', 'EUR');
});

test('serializes a non billable mission with a null rate', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    Mission::factory()->for($client, 'client')->nonBillable()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->getJson('/api/clients')
        ->assertOk()
        ->assertJsonPath('clients.0.missions.0.rate', null);
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
