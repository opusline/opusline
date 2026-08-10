<?php

declare(strict_types=1);

use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

test('another user timer is invisible to every mutation', function (string $method, string $uri, array $payload): void {
    $user = User::factory()->create();
    $stranger = RunningTimer::factory()->create([
        'note' => 'Sprint 24 · specs',
        'accumulated_seconds' => 1_800,
    ]);

    $this->actingAs($user)
        ->json($method, $uri, $payload)
        ->assertNotFound();

    $this->assertDatabaseHas('running_timers', [
        'id' => $stranger->id,
        'note' => 'Sprint 24 · specs',
        'accumulated_seconds' => 1_800,
    ]);
    $this->assertDatabaseCount('time_entries', 0);
})->with([
    'note' => ['PUT', '/api/timer', ['note' => 'Cadrage V2']],
    'pause' => ['POST', '/api/timer/pause', []],
    'resume' => ['POST', '/api/timer/resume', []],
    'trim' => ['POST', '/api/timer/trim', ['seconds' => 1_200]],
    'stop' => ['POST', '/api/timer/stop', ['date' => '2026-08-03', 'durationMinutes' => 210, 'note' => null]],
    'discard' => ['DELETE', '/api/timer', []],
]);

test('every route is closed to guests', function (string $method, string $uri): void {
    $this->json($method, $uri)->assertUnauthorized();
})->with([
    'show' => ['GET', '/api/timer'],
    'start' => ['POST', '/api/timer'],
    'note' => ['PUT', '/api/timer'],
    'discard' => ['DELETE', '/api/timer'],
    'pause' => ['POST', '/api/timer/pause'],
    'resume' => ['POST', '/api/timer/resume'],
    'trim' => ['POST', '/api/timer/trim'],
    'stop' => ['POST', '/api/timer/stop'],
]);
