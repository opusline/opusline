<?php

declare(strict_types=1);

use App\Domain\Timers\Enums\TimerState;
use App\Domain\Users\Models\User;

beforeEach(fn () => test()->freezeTime());

test('pausing banks the segment in flight', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->travel(90)->seconds();

    $this->actingAs($user)
        ->postJson('/api/timer/pause')
        ->assertOk()
        ->assertJsonPath('state', TimerState::Paused->value)
        ->assertJsonPath('elapsedSeconds', 90);

    $timer = $user->runningTimer()->firstOrFail();

    expect($timer->accumulated_seconds)->toBe(90)
        ->and($timer->running_since)->toBeNull();
});

test('pausing twice does not bank the time again', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->travel(60)->seconds();
    $this->actingAs($user)->postJson('/api/timer/pause')->assertOk();

    $this->travel(300)->seconds();

    $this->actingAs($user)
        ->postJson('/api/timer/pause')
        ->assertOk()
        ->assertJsonPath('elapsedSeconds', 60);
});

test('resuming picks up from the banked total', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->travel(60)->seconds();
    $this->actingAs($user)->postJson('/api/timer/pause')->assertOk();

    $this->travel(300)->seconds();
    $this->actingAs($user)
        ->postJson('/api/timer/resume')
        ->assertOk()
        ->assertJsonPath('state', TimerState::Running->value)
        ->assertJsonPath('elapsedSeconds', 60);

    $this->travel(10)->seconds();

    $this->actingAs($user)
        ->getJson('/api/timer')
        ->assertJsonPath('timer.elapsedSeconds', 70);
});

test('resuming a running timer changes nothing', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->travel(45)->seconds();

    $this->actingAs($user)
        ->postJson('/api/timer/resume')
        ->assertOk()
        ->assertJsonPath('state', TimerState::Running->value)
        ->assertJsonPath('elapsedSeconds', 45);
});

test('404s when no timer is running', function (string $uri): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson($uri)
        ->assertNotFound()
        ->assertJsonPath('message', __('timers.not_running'));
})->with([
    'pause' => ['/api/timer/pause'],
    'resume' => ['/api/timer/resume'],
]);

test('returns 401 for guests', function (string $uri): void {
    $this->postJson($uri)->assertUnauthorized();
})->with([
    'pause' => ['/api/timer/pause'],
    'resume' => ['/api/timer/resume'],
]);
