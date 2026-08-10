<?php

declare(strict_types=1);

use App\Domain\Missions\Models\Mission;
use App\Domain\Timers\Enums\TimerState;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

test('starts a timer against a mission', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/timer', ['missionId' => $mission->id])
        ->assertCreated()
        ->assertJsonPath('missionId', $mission->id)
        ->assertJsonPath('missionName', $mission->name)
        ->assertJsonPath('state', TimerState::Running->value)
        ->assertJsonPath('elapsedSeconds', 0)
        ->assertJsonPath('note', null);

    $timer = $user->runningTimer()->firstOrFail();

    expect($timer->mission_id)->toBe($mission->id)
        ->and($timer->accumulated_seconds)->toBe(0)
        ->and($timer->isPaused())->toBeFalse();
});

test('starts a timer on a mission billed by the day', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/timer', ['missionId' => $mission->id])
        ->assertCreated();

    $this->assertDatabaseCount('running_timers', 1);
});

test('refuses to start a second timer and leaves the first alone', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $running = RunningTimer::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);
    $other = missionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/timer', ['missionId' => $other->id])
        ->assertConflict()
        ->assertJsonPath('message', __('timers.already_running'));

    $this->assertDatabaseCount('running_timers', 1);
    expect($user->runningTimer()->firstOrFail()->mission_id)->toBe($running->mission_id);
});

test('rejects an invalid payload', function (array $payload, string $expectedError): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/timer', $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$expectedError]);
})->with([
    'missing mission' => [[], 'missionId'],
    'unknown mission' => [['missionId' => 987_654], 'missionId'],
    'mission is not an integer' => [['missionId' => 'callisto'], 'missionId'],
]);

test('another user holding a timer does not block this one', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    RunningTimer::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/timer', ['missionId' => $mission->id])
        ->assertCreated();

    $this->assertDatabaseCount('running_timers', 2);
});

test('cannot start a timer on another user mission', function (): void {
    $user = User::factory()->create();
    $stranger = Mission::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/timer', ['missionId' => $stranger->id])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['missionId']);

    $this->assertDatabaseCount('running_timers', 0);
});

test('returns 401 for guests', function (): void {
    $mission = Mission::factory()->create();

    $this->postJson('/api/timer', ['missionId' => $mission->id])->assertUnauthorized();
});
