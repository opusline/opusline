<?php

declare(strict_types=1);

use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

test('records the exact time worked on a mission billed by the day', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 180,
            'note' => 'Revue de specs',
        ])
        ->assertCreated()
        ->assertJsonPath('missionId', $mission->id)
        ->assertJsonPath('date', '2026-08-03')
        ->assertJsonPath('durationMinutes', 180)
        ->assertJsonPath('valuedDayFraction', 0.5)
        ->assertJsonPath('valuedMinutes', null)
        ->assertJsonPath('note', 'Revue de specs');

    $this->assertDatabaseHas('time_entries', [
        'user_id' => $user->id,
        'mission_id' => $mission->id,
        'date' => '2026-08-03',
        'duration_minutes' => 180,
    ]);
});

test('values time on a mission billed by the hour in rounded minutes', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->hourly());

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 67,
        ])
        ->assertCreated()
        ->assertJsonPath('durationMinutes', 67)
        ->assertJsonPath('valuedMinutes', 90)
        ->assertJsonPath('valuedDayFraction', null);
});

test('stores the raw duration rather than the rounded one', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->hourly());

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 67,
        ])
        ->assertCreated();

    $this->assertDatabaseHas('time_entries', ['duration_minutes' => 67]);
});

test('accepts several entries on the same mission and day', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    foreach (['Matin', 'Après-midi'] as $note) {
        $this->actingAs($user)
            ->postJson('/api/time-entries', [
                'missionId' => $mission->id,
                'date' => '2026-08-03',
                'durationMinutes' => 210,
                'note' => $note,
            ])
            ->assertCreated();
    }

    expect($mission->timeEntries()->count())->toBe(2);
});

test('rejects a day that would exceed twenty four hours on one mission', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 1_400,
    ]);

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 60,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['durationMinutes']);
});

test('counts the cap across every mission on the same day', function (): void {
    $user = User::factory()->create();
    $first = missionOwnedBy($user);
    $second = missionOwnedBy($user);

    TimeEntry::factory()->for($first, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 1_400,
    ]);

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $second->id,
            'date' => '2026-08-03',
            'durationMinutes' => 240,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['durationMinutes']);
});

test('leaves other days untouched by the cap', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 1_440,
    ]);

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $mission->id,
            'date' => '2026-08-04',
            'durationMinutes' => 420,
        ])
        ->assertCreated();
});

test('rejects an invalid payload', function (array $payload, string $expectedError): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/time-entries', [...$payload, 'missionId' => $payload['missionId'] ?? $mission->id])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$expectedError]);
})->with([
    'missing date' => [['durationMinutes' => 60], 'date'],
    'malformed date' => [['date' => '03/08/2026', 'durationMinutes' => 60], 'date'],
    'missing duration' => [['date' => '2026-08-03'], 'durationMinutes'],
    'zero duration' => [['date' => '2026-08-03', 'durationMinutes' => 0], 'durationMinutes'],
    'more than a full day' => [['date' => '2026-08-03', 'durationMinutes' => 1_441], 'durationMinutes'],
    'unknown mission' => [['missionId' => 987_654, 'date' => '2026-08-03', 'durationMinutes' => 60], 'missionId'],
]);

test('cannot record time against another user mission', function (): void {
    $user = User::factory()->create();
    $stranger = Mission::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $stranger->id,
            'date' => '2026-08-03',
            'durationMinutes' => 60,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['missionId']);

    $this->assertDatabaseCount('time_entries', 0);
});

test('returns 401 for guests', function (): void {
    $mission = Mission::factory()->create();

    $this->postJson('/api/time-entries', [
        'missionId' => $mission->id,
        'date' => '2026-08-03',
        'durationMinutes' => 60,
    ])->assertUnauthorized();
});

test('records an entry as billable unless told otherwise', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 180,
        ])
        ->assertCreated()
        ->assertJsonPath('billable', true);
});

test('records time on a paying mission that will not be invoiced', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 120,
            'billable' => false,
            'note' => 'Analyse avant devis',
        ])
        ->assertCreated()
        ->assertJsonPath('billable', false)
        // Still valued: it is time worked, it just does not reach the invoice.
        ->assertJsonPath('valuedDayFraction', 0.5);

    $this->assertDatabaseHas('time_entries', [
        'mission_id' => $mission->id,
        'billable' => false,
    ]);
});

test('rejects a billable flag that is not a boolean', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 120,
            'billable' => 'peut-être',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('billable');
});
