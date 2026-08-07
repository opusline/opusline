<?php

declare(strict_types=1);

use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

test('returns the entries inside the range, boundaries included', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    foreach (['2026-08-01', '2026-08-03', '2026-08-05'] as $date) {
        TimeEntry::factory()->for($mission, 'mission')->create([
            'date' => $date,
            'duration_minutes' => 60,
        ]);
    }

    $this->actingAs($user)
        ->getJson('/api/time-entries?from=2026-08-01&to=2026-08-05')
        ->assertOk()
        ->assertJsonCount(3, 'timeEntries')
        ->assertJsonPath('timeEntries.0.date', '2026-08-01')
        ->assertJsonPath('timeEntries.2.date', '2026-08-05');
});

test('returns a single day when both bounds are the same date', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    foreach (['2026-08-02', '2026-08-03', '2026-08-04'] as $date) {
        TimeEntry::factory()->for($mission, 'mission')->create([
            'date' => $date,
            'duration_minutes' => 60,
        ]);
    }

    $this->actingAs($user)
        ->getJson('/api/time-entries?from=2026-08-03&to=2026-08-03')
        ->assertOk()
        ->assertJsonCount(1, 'timeEntries')
        ->assertJsonPath('timeEntries.0.date', '2026-08-03');
});

test('excludes entries belonging to another user', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 60,
    ]);
    TimeEntry::factory()->create(['date' => '2026-08-03', 'duration_minutes' => 60]);

    $this->actingAs($user)
        ->getJson('/api/time-entries?from=2026-08-03&to=2026-08-03')
        ->assertOk()
        ->assertJsonCount(1, 'timeEntries');
});

test('values each entry in its own mission unit', function (): void {
    $user = User::factory()->create();
    $daily = missionOwnedBy($user);
    $hourly = missionOwnedBy($user, fn ($factory) => $factory->hourly());

    TimeEntry::factory()->for($daily, 'mission')->create([
        'date' => '2026-08-03', 'duration_minutes' => 210,
    ]);
    TimeEntry::factory()->for($hourly, 'mission')->create([
        'date' => '2026-08-03', 'duration_minutes' => 67,
    ]);

    $this->actingAs($user)
        ->getJson('/api/time-entries?from=2026-08-03&to=2026-08-03')
        ->assertOk()
        ->assertJsonPath('timeEntries.0.valuedDayFraction', 0.5)
        ->assertJsonPath('timeEntries.0.valuedMinutes', null)
        ->assertJsonPath('timeEntries.1.valuedDayFraction', null)
        ->assertJsonPath('timeEntries.1.valuedMinutes', 90);
});

test('rejects an unusable range', function (string $query, string $expectedError): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson("/api/time-entries?{$query}")
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$expectedError]);
})->with([
    'missing from' => ['to=2026-08-03', 'from'],
    'missing to' => ['from=2026-08-03', 'to'],
    'end before start' => ['from=2026-08-05&to=2026-08-01', 'to'],
    'malformed date' => ['from=01-08-2026&to=2026-08-03', 'from'],
    'wider than a year' => ['from=2025-01-01&to=2026-08-03', 'to'],
]);

test('returns 401 for guests', function (): void {
    $this->getJson('/api/time-entries?from=2026-08-03&to=2026-08-03')->assertUnauthorized();
});
