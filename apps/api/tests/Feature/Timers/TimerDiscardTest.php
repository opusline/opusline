<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('throws the timer away without recording anything', function (): void {
    $user = User::factory()->create();
    runningTimerFor($user);

    $this->actingAs($user)
        ->deleteJson('/api/timer')
        ->assertNoContent();

    $this->assertDatabaseCount('running_timers', 0);
    $this->assertDatabaseCount('time_entries', 0);
});

test('404s when no timer is running', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->deleteJson('/api/timer')
        ->assertNotFound()
        ->assertJsonPath('message', __('timers.not_running'));
});

test('returns 401 for guests', function (): void {
    $this->deleteJson('/api/timer')->assertUnauthorized();
});
