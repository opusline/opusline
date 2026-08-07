<?php

declare(strict_types=1);

use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

test('updates the recorded duration and note', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $entry = TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 180,
    ]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $mission->id,
            'date' => '2026-08-04',
            'durationMinutes' => 420,
            'note' => 'Journée complète',
        ])
        ->assertOk()
        ->assertJsonPath('date', '2026-08-04')
        ->assertJsonPath('durationMinutes', 420)
        ->assertJsonPath('valuedDayFraction', 1);

    $this->assertDatabaseHas('time_entries', [
        'id' => $entry->id,
        'date' => '2026-08-04',
        'duration_minutes' => 420,
        'note' => 'Journée complète',
    ]);
});

test('moves an entry to another mission and values it in that mission unit', function (): void {
    $user = User::factory()->create();
    $daily = missionOwnedBy($user);
    $hourly = missionOwnedBy($user, fn ($factory) => $factory->hourly());
    $entry = TimeEntry::factory()->for($daily, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 67,
    ]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $hourly->id,
            'date' => '2026-08-03',
            'durationMinutes' => 67,
        ])
        ->assertOk()
        ->assertJsonPath('missionId', $hourly->id)
        ->assertJsonPath('valuedMinutes', 90)
        ->assertJsonPath('valuedDayFraction', null);
});

test('does not count the edited entry against its own daily cap', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $entry = TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 1_440,
    ]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 1_440,
        ])
        ->assertOk();
});

test('rejects an update that would push the mission past twenty four hours', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 1_400,
    ]);
    $entry = TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 40,
    ]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 120,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['durationMinutes']);
});

test('cannot move an entry onto another user mission', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $entry = TimeEntry::factory()->for($mission, 'mission')->create();
    $stranger = Mission::factory()->create();

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $stranger->id,
            'date' => '2026-08-03',
            'durationMinutes' => 60,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['missionId']);
});

test('cannot update another user entry', function (): void {
    $entry = TimeEntry::factory()->create();

    $this->actingAs(User::factory()->create())
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $entry->mission_id,
            'date' => '2026-08-03',
            'durationMinutes' => 60,
        ])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $entry = TimeEntry::factory()->create();

    $this->putJson("/api/time-entries/{$entry->id}", [
        'missionId' => $entry->mission_id,
        'date' => '2026-08-03',
        'durationMinutes' => 60,
    ])->assertUnauthorized();
});
