<?php

declare(strict_types=1);

use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

test('counts the weekdays of the month less the public holidays', function (): void {
    $user = User::factory()->create();

    // July 2026 holds 23 weekdays; 14 July falls on the Tuesday.
    $this->actingAs($user)
        ->getJson('/api/time-entries/month-workload?month=2026-07')
        ->assertOk()
        ->assertJsonPath('month', '2026-07')
        ->assertJsonPath('businessDays', 22);
});

test('keeps every weekday when the holiday falls on a weekend', function (): void {
    $user = User::factory()->create();

    // 15 August 2026 is a Saturday, so it costs the month nothing.
    $this->actingAs($user)
        ->getJson('/api/time-entries/month-workload?month=2026-08')
        ->assertOk()
        ->assertJsonPath('businessDays', 21);
});

test('counts plain weekdays for a country with no holiday calendar', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'DE']);

    $this->actingAs($user)
        ->getJson('/api/time-entries/month-workload?month=2026-07')
        ->assertOk()
        ->assertJsonPath('businessDays', 23);
});

test('counts a short day as a whole day: the day was worked', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 30,
    ]);

    $this->actingAs($user)
        ->getJson('/api/time-entries/month-workload?month=2026-08')
        ->assertOk()
        ->assertJsonPath('workedDays', 1);
});

test('counts a day once however many entries share it', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    foreach ([105, 105, 60] as $minutes) {
        TimeEntry::factory()->for($mission, 'mission')->create([
            'date' => '2026-08-03',
            'duration_minutes' => $minutes,
        ]);
    }

    $this->actingAs($user)
        ->getJson('/api/time-entries/month-workload?month=2026-08')
        ->assertOk()
        ->assertJsonPath('workedDays', 1);
});

test('counts a long day as one day, so overtime cannot pass the month', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 840,
    ]);

    $this->actingAs($user)
        ->getJson('/api/time-entries/month-workload?month=2026-08')
        ->assertOk()
        ->assertJsonPath('workedDays', 1);
});

test('counts each worked day of the month', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    foreach (['2026-08-03', '2026-08-04', '2026-08-05'] as $date) {
        TimeEntry::factory()->for($mission, 'mission')->create([
            'date' => $date,
            'duration_minutes' => 120,
        ]);
    }

    $this->actingAs($user)
        ->getJson('/api/time-entries/month-workload?month=2026-08')
        ->assertOk()
        ->assertJsonPath('workedDays', 3);
});

test('counts non-billable time: the day was worked either way', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 420,
        'billable' => false,
    ]);

    $this->actingAs($user)
        ->getJson('/api/time-entries/month-workload?month=2026-08')
        ->assertOk()
        ->assertJsonPath('workedDays', 1);
});

test('ignores the days sitting outside the month', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    foreach (['2026-07-31', '2026-09-01'] as $date) {
        TimeEntry::factory()->for($mission, 'mission')->create([
            'date' => $date,
            'duration_minutes' => 420,
        ]);
    }

    $this->actingAs($user)
        ->getJson('/api/time-entries/month-workload?month=2026-08')
        ->assertOk()
        ->assertJsonPath('workedDays', 0);
});

test('excludes the time tracked by another user', function (): void {
    $user = User::factory()->create();

    TimeEntry::factory()->create([
        'date' => '2026-08-03',
        'duration_minutes' => 420,
    ]);

    $this->actingAs($user)
        ->getJson('/api/time-entries/month-workload?month=2026-08')
        ->assertOk()
        ->assertJsonPath('workedDays', 0);
});

test('rejects a month it cannot read', function (string $month): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson("/api/time-entries/month-workload?month={$month}")
        ->assertStatus(422)
        ->assertJsonValidationErrors('month');
})->with(['2026', '2026-13', '2026-00', '2026-8', 'aout', '2026-08-01', '0001-01', '9999-12']);

test('requires the month', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/time-entries/month-workload')
        ->assertStatus(422)
        ->assertJsonValidationErrors('month');
});

test('requires authentication', function (): void {
    $this->getJson('/api/time-entries/month-workload?month=2026-08')
        ->assertStatus(401);
});

test('bounds the year so the holiday cache cannot be grown at will', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/time-entries/month-workload?month=1899-01')
        ->assertStatus(422)
        ->assertJsonValidationErrors('month');
});
