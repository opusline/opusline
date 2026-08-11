<?php

declare(strict_types=1);

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

test('values an entry at its mission rounding when it sets none', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => BillingMode::Daily,
        'rounding' => EntryRounding::Half,
    ]));

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 222,
        ])
        ->assertCreated()
        ->assertJsonPath('rounding', null)
        ->assertJsonPath('valuedDayFraction', 1);
});

test('values an entry at its own rounding when it overrides the mission', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => BillingMode::Daily,
        'rounding' => EntryRounding::Half,
    ]));

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 222,
            'rounding' => EntryRounding::Minute->value,
        ])
        ->assertCreated()
        ->assertJsonPath('rounding', EntryRounding::Minute->value)
        ->assertJsonPath('valuedDayFraction', 222 / 420);
});

test('carries the override through when a timer is stopped', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => BillingMode::Daily,
        'rounding' => EntryRounding::Half,
    ]));
    RunningTimer::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson('/api/timer/stop', [
            'date' => '2026-08-03',
            'durationMinutes' => 222,
            'rounding' => EntryRounding::Minute->value,
            'note' => null,
        ])
        ->assertCreated()
        ->assertJsonPath('valuedDayFraction', 222 / 420);

    $this->assertDatabaseHas('time_entries', [
        'mission_id' => $mission->id,
        'rounding' => EntryRounding::Minute->value,
    ]);
});

test('inherits the mission rounding when the timer stops without an override', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => BillingMode::Daily,
        'rounding' => EntryRounding::Half,
    ]));
    RunningTimer::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson('/api/timer/stop', [
            'date' => '2026-08-03',
            'durationMinutes' => 222,
            'note' => null,
        ])
        ->assertCreated()
        ->assertJsonPath('rounding', null)
        ->assertJsonPath('valuedDayFraction', 1);
});

test('re-values an inheriting entry when the mission rounding changes', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => BillingMode::Daily,
        'rounding' => EntryRounding::Half,
    ]));

    $timeEntry = TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'duration_minutes' => 222,
        'rounding' => null,
    ]);

    expect($timeEntry->fresh()->valuedDayFraction())->toBe(1.0);

    $mission->update(['rounding' => EntryRounding::Minute]);

    expect($timeEntry->fresh()->valuedDayFraction())->toBe(222 / 420);
});

test('leaves an overriding entry alone when the mission rounding changes', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => BillingMode::Daily,
        'rounding' => EntryRounding::Half,
    ]));

    $timeEntry = TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'duration_minutes' => 222,
        'rounding' => EntryRounding::Minute,
    ]);

    $mission->update(['rounding' => EntryRounding::Quarter]);

    expect($timeEntry->fresh()->valuedDayFraction())->toBe(222 / 420);
});

test('changes an entry rounding on update', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => BillingMode::Daily,
        'rounding' => EntryRounding::Half,
    ]));

    $timeEntry = TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'duration_minutes' => 222,
        'rounding' => null,
    ]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$timeEntry->id}", [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 222,
            'rounding' => EntryRounding::Minute->value,
        ])
        ->assertOk()
        ->assertJsonPath('rounding', EntryRounding::Minute->value)
        ->assertJsonPath('valuedDayFraction', 222 / 420);

    $this->assertDatabaseHas('time_entries', [
        'id' => $timeEntry->id,
        'rounding' => EntryRounding::Minute->value,
    ]);
});

test('clears an entry rounding back to the mission default', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => BillingMode::Daily,
        'rounding' => EntryRounding::Half,
    ]));

    $timeEntry = TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'duration_minutes' => 222,
        'rounding' => EntryRounding::Minute,
    ]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$timeEntry->id}", [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 222,
        ])
        ->assertOk()
        ->assertJsonPath('rounding', null)
        ->assertJsonPath('valuedDayFraction', 1);
});

test('rejects a rounding that is not a known increment', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 60,
            'rounding' => 99,
        ])
        ->assertJsonValidationErrors('rounding');
});
