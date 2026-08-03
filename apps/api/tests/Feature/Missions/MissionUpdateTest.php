<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

test('updates a mission', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => 'Renamed',
            'status' => MissionStatus::Paused->value,
            'rate' => ['amount' => 60_000, 'currency' => 'EUR'],
            'startDate' => '2026-08-01',
            'endDate' => '2026-12-31',
        ])
        ->assertOk()
        ->assertJsonPath('name', 'Renamed')
        ->assertJsonPath('status', MissionStatus::Paused->value)
        ->assertJsonPath('rate.amount', 60_000);

    $this->assertDatabaseHas('missions', [
        'id' => $mission->id,
        'name' => 'Renamed',
        'status' => MissionStatus::Paused->value,
        'rate_cents' => 60_000,
    ]);
});

test('makes a mission non billable when the rate is omitted', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'status' => MissionStatus::Active->value,
        ])
        ->assertOk()
        ->assertJsonPath('rate', null);

    $this->assertDatabaseHas('missions', ['id' => $mission->id, 'rate_cents' => null]);
});

test('does not change the billing mode', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'status' => MissionStatus::Active->value,
            'billingMode' => BillingMode::Hourly->value,
        ])
        ->assertOk()
        ->assertJsonPath('billingMode', BillingMode::Daily->value);

    expect($mission->refresh()->billing_mode)->toBe(BillingMode::Daily);
});

test('does not move the mission to another client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $otherClient = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'status' => MissionStatus::Active->value,
            'clientId' => $otherClient->id,
        ])
        ->assertOk()
        ->assertJsonPath('clientId', $client->id);
});

test('rejects an end client equal to the billing client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'status' => MissionStatus::Active->value,
            'endClientId' => $client->id,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['endClientId']);
});

test('cannot update a mission through a different client of the same user', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $otherClient = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$otherClient->id}/missions/{$mission->id}", [
            'name' => 'Hijacked',
            'status' => MissionStatus::Active->value,
        ])
        ->assertNotFound();
});

test('cannot update another user mission', function (): void {
    $mission = Mission::factory()->create();

    $this->actingAs(User::factory()->create())
        ->putJson("/api/clients/{$mission->client_id}/missions/{$mission->id}", [
            'name' => 'Hijacked',
            'status' => MissionStatus::Active->value,
        ])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $mission = Mission::factory()->create();

    $this->putJson("/api/clients/{$mission->client_id}/missions/{$mission->id}", [
        'name' => 'X',
        'status' => MissionStatus::Active->value,
    ])->assertUnauthorized();
});
