<?php

declare(strict_types=1);

use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

test('stores the activity typed while the timer runs', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->actingAs($user)
        ->putJson('/api/timer', ['note' => 'Cadrage V2'])
        ->assertOk()
        ->assertJsonPath('note', 'Cadrage V2');

    expect($user->runningTimer()->firstOrFail()->note)->toBe('Cadrage V2');
});

test('clears the activity when sent an explicit null', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    RunningTimer::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'note' => 'Cadrage V2',
    ]);

    $this->actingAs($user)
        ->putJson('/api/timer', ['note' => null])
        ->assertOk()
        ->assertJsonPath('note', null);

    expect($user->runningTimer()->firstOrFail()->note)->toBeNull();
});

test('refuses an empty payload rather than silently wiping the activity', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    RunningTimer::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'note' => 'Cadrage V2',
    ]);

    $this->actingAs($user)
        ->putJson('/api/timer', [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['note']);

    expect($user->runningTimer()->firstOrFail()->note)->toBe('Cadrage V2');
});

test('rejects an activity longer than the column allows', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->actingAs($user)
        ->putJson('/api/timer', ['note' => str_repeat('a', 2_001)])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['note']);
});

test('404s when no timer is running', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/timer', ['note' => 'Cadrage V2'])
        ->assertNotFound()
        ->assertJsonPath('message', __('timers.not_running'));
});

test('returns 401 for guests', function (): void {
    $this->putJson('/api/timer', ['note' => 'Cadrage V2'])->assertUnauthorized();
});
