<?php

declare(strict_types=1);

use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

test('materialises the timer into a time entry and clears it', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    RunningTimer::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson('/api/timer/stop', [
            'date' => '2026-08-03',
            'durationMinutes' => 210,
            'note' => 'Revue de specs',
        ])
        ->assertCreated()
        ->assertJsonPath('missionId', $mission->id)
        ->assertJsonPath('date', '2026-08-03')
        ->assertJsonPath('durationMinutes', 210)
        ->assertJsonPath('note', 'Revue de specs');

    $this->assertDatabaseCount('running_timers', 0);
    $this->assertDatabaseHas('time_entries', [
        'user_id' => $user->id,
        'mission_id' => $mission->id,
        'duration_minutes' => 210,
    ]);
});

test('stores the duration the user confirmed, whichever rounding they picked', function (int $durationMinutes): void {
    $user = User::factory()->create();
    runningTimerFor($user, configure: fn ($factory) => $factory->state(['accumulated_seconds' => 425 * 60]));

    $this->actingAs($user)
        ->postJson('/api/timer/stop', [
            'date' => '2026-08-03',
            'durationMinutes' => $durationMinutes,
            'note' => null,
        ])
        ->assertCreated()
        ->assertJsonPath('durationMinutes', $durationMinutes);

    $this->assertDatabaseHas('time_entries', ['duration_minutes' => $durationMinutes]);
})->with([
    'half a day' => [210],
    'a full day' => [420],
    'the raw elapsed time' => [222],
]);

test('records the activity the stop dialog sent', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    RunningTimer::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'note' => 'Filtre agences',
    ]);

    $this->actingAs($user)
        ->postJson('/api/timer/stop', [
            'date' => '2026-08-03',
            'durationMinutes' => 210,
            'note' => 'Revue PR',
        ])
        ->assertCreated()
        ->assertJsonPath('note', 'Revue PR');
});

test('saves an entry with no activity when the user cleared it', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    RunningTimer::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'note' => 'Filtre agences',
    ]);

    $this->actingAs($user)
        ->postJson('/api/timer/stop', [
            'date' => '2026-08-03',
            'durationMinutes' => 210,
            'note' => null,
        ])
        ->assertCreated()
        ->assertJsonPath('note', null);

    $this->assertDatabaseHas('time_entries', ['mission_id' => $mission->id, 'note' => null]);
});

test('values the entry against the mission rounding', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->hourly());
    RunningTimer::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'accumulated_seconds' => 67 * 60,
    ]);

    $this->actingAs($user)
        ->postJson('/api/timer/stop', ['date' => '2026-08-03', 'durationMinutes' => 67, 'note' => null])
        ->assertCreated()
        ->assertJsonPath('valuedMinutes', 90)
        ->assertJsonPath('valuedDayFraction', null);
});

test('records the entry as billable unless told otherwise', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->actingAs($user)
        ->postJson('/api/timer/stop', ['date' => '2026-08-03', 'durationMinutes' => 210, 'note' => null])
        ->assertCreated()
        ->assertJsonPath('billable', true);
});

test('honours a non-billable stop', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->actingAs($user)
        ->postJson('/api/timer/stop', [
            'date' => '2026-08-03',
            'durationMinutes' => 210,
            'note' => null,
            'billable' => false,
        ])
        ->assertCreated()
        ->assertJsonPath('billable', false);
});

test('rejects a duration beyond what the timer measured', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->hourly());
    // Banked exactly one hour: the coarsest offered increment leaves 90 minutes out of reach.
    $timer = RunningTimer::factory()->for($mission, 'mission')->paused()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson('/api/timer/stop', ['date' => '2026-08-03', 'durationMinutes' => 90, 'note' => null])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['durationMinutes']);

    // Nothing tracked may be lost: the refused stop has to leave the timer
    // behind, untouched — still paused, with the banked hour intact.
    $this->assertDatabaseCount('running_timers', 1);
    $this->assertDatabaseCount('time_entries', 0);
    expect($timer->refresh()->accumulated_seconds)->toBe(3_600)
        ->and($timer->isPaused())->toBeTrue();
});

test('allows rounding the duration up to the next billing increment', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->hourly());
    RunningTimer::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'accumulated_seconds' => 67 * 60,
    ]);

    $this->actingAs($user)
        ->postJson('/api/timer/stop', ['date' => '2026-08-03', 'durationMinutes' => 90, 'note' => null])
        ->assertCreated()
        ->assertJsonPath('durationMinutes', 90);
});

test('keeps the timer running when the stop would breach the daily cap', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 1_400,
    ]);

    RunningTimer::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson('/api/timer/stop', ['date' => '2026-08-03', 'durationMinutes' => 60, 'note' => null])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['durationMinutes']);

    // Nothing tracked may be lost: the rollback has to leave the timer behind.
    $this->assertDatabaseCount('running_timers', 1);
    $this->assertDatabaseCount('time_entries', 1);
    expect($user->runningTimer()->firstOrFail()->isPaused())->toBeFalse();
});

test('rejects an invalid payload', function (array $payload, string $expectedError): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->actingAs($user)
        ->postJson('/api/timer/stop', $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$expectedError]);
})->with([
    'missing date' => [['durationMinutes' => 60, 'note' => null], 'date'],
    'malformed date' => [['date' => '03/08/2026', 'durationMinutes' => 60, 'note' => null], 'date'],
    'missing duration' => [['date' => '2026-08-03', 'note' => null], 'durationMinutes'],
    'zero duration' => [['date' => '2026-08-03', 'durationMinutes' => 0, 'note' => null], 'durationMinutes'],
    'more than a full day' => [['date' => '2026-08-03', 'durationMinutes' => 1_441, 'note' => null], 'durationMinutes'],
    'missing activity' => [['date' => '2026-08-03', 'durationMinutes' => 210], 'note'],
    'activity past the column limit' => [
        ['date' => '2026-08-03', 'durationMinutes' => 210, 'note' => str_repeat('a', 2_001)],
        'note',
    ],
]);

test('404s when no timer is running', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/timer/stop', ['date' => '2026-08-03', 'durationMinutes' => 210, 'note' => null])
        ->assertNotFound()
        ->assertJsonPath('message', __('timers.not_running'));

    $this->assertDatabaseCount('time_entries', 0);
});

test('returns 401 for guests', function (): void {
    $this->postJson('/api/timer/stop', ['date' => '2026-08-03', 'durationMinutes' => 210, 'note' => null])
        ->assertUnauthorized();
});
