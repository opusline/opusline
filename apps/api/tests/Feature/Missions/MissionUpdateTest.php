<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

test('updates a mission', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/missions/{$mission->id}", [
            'name' => 'Renamed',
            'status' => 'paused',
            'rate' => ['amount' => 60_000, 'currency' => 'EUR'],
            'startDate' => '2026-08-01',
            'endDate' => '2026-12-31',
        ])
        ->assertOk()
        ->assertJsonPath('name', 'Renamed')
        ->assertJsonPath('status', 'paused')
        ->assertJsonPath('rate.amount', 60_000);

    $this->assertDatabaseHas('missions', [
        'id' => $mission->id,
        'name' => 'Renamed',
        'status' => 'paused',
        'rate_cents' => 60_000,
    ]);
});

test('makes a mission non billable when the rate is omitted', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/missions/{$mission->id}", ['name' => $mission->name, 'status' => 'active'])
        ->assertOk()
        ->assertJsonPath('rate', null);

    $this->assertDatabaseHas('missions', ['id' => $mission->id, 'rate_cents' => null]);
});

test('does not change the billing mode', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/missions/{$mission->id}", [
            'name' => $mission->name,
            'status' => 'active',
            'billingMode' => 'hourly',
        ])
        ->assertOk()
        ->assertJsonPath('billingMode', 'daily');

    expect($mission->refresh()->billing_mode)->toBe(BillingMode::Daily);
});

test('does not move the mission to another client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $otherClient = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/missions/{$mission->id}", [
            'name' => $mission->name,
            'status' => 'active',
            'clientSlug' => $otherClient->slug,
        ])
        ->assertOk()
        ->assertJsonPath('clientSlug', $client->slug);
});

test('rejects an end client equal to the billing client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/missions/{$mission->id}", [
            'name' => $mission->name,
            'status' => 'active',
            'endClientSlug' => $client->slug,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['endClientSlug']);
});

test('cannot update another user mission', function (): void {
    $mission = Mission::factory()->create();

    $this->actingAs(User::factory()->create())
        ->putJson("/api/missions/{$mission->id}", ['name' => 'Hijacked', 'status' => 'active'])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $mission = Mission::factory()->create();

    $this->putJson("/api/missions/{$mission->id}", ['name' => 'X', 'status' => 'active'])
        ->assertUnauthorized();
});
