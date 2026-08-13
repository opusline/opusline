<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

test('deletes a mission', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$client->slug}/missions/{$mission->slug}")
        ->assertNoContent();

    $this->assertDatabaseMissing('missions', ['id' => $mission->id]);
});

test('refuses to delete a mission that still carries tracked time', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$client->slug}/missions/{$mission->slug}")
        ->assertStatus(409);

    $this->assertDatabaseHas('missions', ['id' => $mission->id]);
});

test('cannot delete a mission through a different client of the same user', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $otherClient = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$otherClient->slug}/missions/{$mission->slug}")
        ->assertNotFound();

    $this->assertDatabaseHas('missions', ['id' => $mission->id]);
});

test('refuses to delete a mission with a running timer', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $timer = RunningTimer::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$client->slug}/missions/{$mission->slug}")
        ->assertConflict()
        ->assertJsonPath('message', __('missions.cannot_delete_with_running_timer'));

    $this->assertDatabaseHas('missions', ['id' => $mission->id]);
    $this->assertDatabaseHas('running_timers', [
        'id' => $timer->id,
        'mission_id' => $mission->id,
    ]);
});

test('refuses to delete a mission that still carries invoices', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    invoiceOwnedBy($user, $mission->client, fn ($factory) => $factory->state([
        'mission_id' => $mission->id,
    ]));

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_delete_mission_with_invoices'));

    $this->assertDatabaseHas('missions', ['id' => $mission->id]);
});

test('refuses to delete a mission that still carries comptes rendus', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->requiringCra());

    craOwnedBy($user, $mission);

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}")
        ->assertConflict()
        ->assertJsonPath('message', __('missions.cannot_delete_with_cras'));

    $this->assertDatabaseHas('missions', ['id' => $mission->id]);
});

test('cannot delete another user mission', function (): void {
    $mission = Mission::factory()->create();

    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}")
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $mission = Mission::factory()->create();

    $this->deleteJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}")
        ->assertUnauthorized();
});
