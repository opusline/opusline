<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

test('deletes a mission', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$client->id}/missions/{$mission->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('missions', ['id' => $mission->id]);
});

test('cannot delete a mission through a different client of the same user', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $otherClient = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$otherClient->id}/missions/{$mission->id}")
        ->assertNotFound();

    $this->assertDatabaseHas('missions', ['id' => $mission->id]);
});

test('cannot delete another user mission', function (): void {
    $mission = Mission::factory()->create();

    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/clients/{$mission->client_id}/missions/{$mission->id}")
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $mission = Mission::factory()->create();

    $this->deleteJson("/api/clients/{$mission->client_id}/missions/{$mission->id}")
        ->assertUnauthorized();
});
