<?php

declare(strict_types=1);

use App\Domain\Timers\Enums\TimerState;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

beforeEach(fn () => test()->freezeTime());

test('subtracts an idle span and keeps running', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->travel(3_600)->seconds();

    $this->actingAs($user)
        ->postJson('/api/timer/trim', ['seconds' => 1_200])
        ->assertOk()
        ->assertJsonPath('state', TimerState::Running->value)
        ->assertJsonPath('elapsedSeconds', 2_400);

    $this->travel(10)->seconds();

    $this->actingAs($user)
        ->getJson('/api/timer')
        ->assertJsonPath('timer.elapsedSeconds', 2_410);
});

test('subtracts an idle span while paused without resuming', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user, configure: fn ($factory) => $factory->paused());

    $this->actingAs($user)
        ->postJson('/api/timer/trim', ['seconds' => 1_200])
        ->assertOk()
        ->assertJsonPath('state', TimerState::Paused->value)
        ->assertJsonPath('elapsedSeconds', 2_400);
});

test('clamps at zero when the idle span is longer than the elapsed time', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->travel(60)->seconds();

    $this->actingAs($user)
        ->postJson('/api/timer/trim', ['seconds' => 3_600])
        ->assertOk()
        ->assertJsonPath('elapsedSeconds', 0);
});

test('leaves the start time alone', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $timer = RunningTimer::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->travel(3_600)->seconds();

    $this->actingAs($user)
        ->postJson('/api/timer/trim', ['seconds' => 1_200])
        ->assertOk()
        ->assertJsonPath('startedAt', $timer->started_at->toAtomString());
});

test('rejects an invalid span', function (mixed $seconds): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->actingAs($user)
        ->postJson('/api/timer/trim', ['seconds' => $seconds])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['seconds']);
})->with([
    'zero' => [0],
    'negative' => [-60],
    'longer than a day' => [86_401],
    'not a number' => ['vingt minutes'],
]);

test('404s when no timer is running', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/timer/trim', ['seconds' => 1_200])
        ->assertNotFound()
        ->assertJsonPath('message', __('timers.not_running'));
});

test('returns 401 for guests', function (): void {
    $this->postJson('/api/timer/trim', ['seconds' => 1_200])->assertUnauthorized();
});
