<?php

declare(strict_types=1);

use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Enums\TimerState;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

beforeEach(fn () => test()->freezeTime());

test('reports no timer rather than a 404 when none is running', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/timer')
        ->assertOk()
        ->assertJsonPath('timer', null)
        ->assertJsonPath('lastMissionId', null);
});

test('reports an elapsed count that advances with the clock', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    RunningTimer::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->travel(42)->seconds();

    $this->actingAs($user)
        ->getJson('/api/timer')
        ->assertOk()
        ->assertJsonPath('timer.state', TimerState::Running->value)
        ->assertJsonPath('timer.elapsedSeconds', 42)
        ->assertJsonPath('timer.missionName', $mission->name);
});

test('freezes the elapsed count while paused', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user, configure: fn ($factory) => $factory->paused());

    $this->travel(300)->seconds();

    $this->actingAs($user)
        ->getJson('/api/timer')
        ->assertOk()
        ->assertJsonPath('timer.state', TimerState::Paused->value)
        ->assertJsonPath('timer.elapsedSeconds', 3_600);
});

test('reports the start time as the wall clock moment it began', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $timer = RunningTimer::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->travel(120)->seconds();

    $this->actingAs($user)
        ->getJson('/api/timer')
        ->assertOk()
        ->assertJsonPath('timer.startedAt', $timer->started_at->toAtomString());
});

test('badges the mission of the most recently recorded entry', function (): void {
    $user = User::factory()->create();
    $older = missionOwnedBy($user);
    $newest = missionOwnedBy($user);

    TimeEntry::factory()->for($older, 'mission')->create(['date' => '2026-08-03']);
    TimeEntry::factory()->for($newest, 'mission')->create(['date' => '2026-08-04']);

    $this->actingAs($user)
        ->getJson('/api/timer')
        ->assertOk()
        ->assertJsonPath('lastMissionId', $newest->id);
});

test('a backfilled entry does not hijack the suggested mission', function (): void {
    $user = User::factory()->create();
    $workedToday = missionOwnedBy($user);
    $backfilled = missionOwnedBy($user);

    TimeEntry::factory()->for($workedToday, 'mission')->create(['date' => '2026-08-05']);
    // Entered later, but for an earlier day — insertion order must not win.
    TimeEntry::factory()->for($backfilled, 'mission')->create(['date' => '2026-08-01']);

    $this->actingAs($user)
        ->getJson('/api/timer')
        ->assertOk()
        ->assertJsonPath('lastMissionId', $workedToday->id);
});

test('does not reveal another user timer', function (): void {
    $user = User::factory()->create();
    RunningTimer::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/timer')
        ->assertOk()
        ->assertJsonPath('timer', null);
});

test('returns 401 for guests', function (): void {
    $this->getJson('/api/timer')->assertUnauthorized();
});
