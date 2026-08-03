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
        ->deleteJson("/api/missions/{$mission->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('missions', ['id' => $mission->id]);
});

test('cannot delete another user mission', function (): void {
    $mission = Mission::factory()->create();

    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/missions/{$mission->id}")
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $mission = Mission::factory()->create();

    $this->deleteJson("/api/missions/{$mission->id}")->assertUnauthorized();
});
