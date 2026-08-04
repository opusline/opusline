<?php

declare(strict_types=1);

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Color;
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

test('embeds each client missions ordered by name', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Alpha']);
    Client::factory()->for($user)->create(['name' => 'Beta']);
    Mission::factory()->for($client, 'client')->create(['user_id' => $user->id, 'name' => 'Refonte front']);
    Mission::factory()->for($client, 'client')->create(['user_id' => $user->id, 'name' => 'Audit']);

    $this->actingAs($user)
        ->getJson('/api/clients')
        ->assertOk()
        ->assertJsonCount(2, 'clients.0.missions')
        ->assertJsonPath('clients.0.missions.0.name', 'Audit')
        ->assertJsonPath('clients.0.missions.1.name', 'Refonte front')
        ->assertJsonPath('clients.1.missions', []);
});

test('exposes the client type, color and payment terms', function (): void {
    $user = User::factory()->create();
    Client::factory()->for($user)->intermediary()->create([
        'color' => Color::Sage,
        'payment_terms_days' => 60,
    ]);

    $this->actingAs($user)
        ->getJson('/api/clients')
        ->assertOk()
        ->assertJsonPath('clients.0.type', ClientType::Intermediary->value)
        ->assertJsonPath('clients.0.color', Color::Sage->value)
        ->assertJsonPath('clients.0.paymentTermsDays', 60);
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
