<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

test('shows a mission', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create([
        'user_id' => $user->id,
        'name' => 'Callisto front',
        'start_date' => '2025-03-03',
    ]);

    $this->actingAs($user)
        ->getJson("/api/clients/{$client->slug}/missions/{$mission->slug}")
        ->assertOk()
        ->assertJsonPath('id', $mission->id)
        ->assertJsonPath('clientId', $client->id)
        ->assertJsonPath('name', 'Callisto front')
        ->assertJsonPath('billingMode', BillingMode::Daily->value)
        ->assertJsonPath('rate.amount', 55_000)
        ->assertJsonPath('startDate', '2025-03-03');
});

test('cannot show a mission through a different client of the same user', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $otherClient = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->getJson("/api/clients/{$otherClient->slug}/missions/{$mission->slug}")
        ->assertNotFound();
});

test('cannot show another user mission', function (): void {
    $mission = Mission::factory()->create();

    $this->actingAs(User::factory()->create())
        ->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}")
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $mission = Mission::factory()->create();

    $this->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}")
        ->assertUnauthorized();
});
