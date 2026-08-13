<?php

declare(strict_types=1);

use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

test('updates the recorded duration and note', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $entry = TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 180,
    ]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $mission->id,
            'date' => '2026-08-04',
            'durationMinutes' => 420,
            'note' => 'Journée complète',
        ])
        ->assertOk()
        ->assertJsonPath('date', '2026-08-04')
        ->assertJsonPath('durationMinutes', 420)
        ->assertJsonPath('valuedDayFraction', 1);

    $this->assertDatabaseHas('time_entries', [
        'id' => $entry->id,
        'date' => '2026-08-04',
        'duration_minutes' => 420,
        'note' => 'Journée complète',
    ]);
});

test('moves an entry to another mission and values it in that mission unit', function (): void {
    $user = User::factory()->create();
    $daily = missionOwnedBy($user);
    $hourly = missionOwnedBy($user, fn ($factory) => $factory->hourly());
    $entry = TimeEntry::factory()->for($daily, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 67,
    ]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $hourly->id,
            'date' => '2026-08-03',
            'durationMinutes' => 67,
        ])
        ->assertOk()
        ->assertJsonPath('missionId', $hourly->id)
        ->assertJsonPath('valuedMinutes', 90)
        ->assertJsonPath('valuedDayFraction', null);
});

test('does not count the edited entry against its own daily cap', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $entry = TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 1_440,
    ]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 1_440,
        ])
        ->assertOk();
});

test('rejects an update that would push the mission past twenty four hours', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 1_400,
    ]);
    $entry = TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => 40,
    ]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 120,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['durationMinutes']);
});

test('cannot move an entry onto another user mission', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $entry = TimeEntry::factory()->for($mission, 'mission')->create();
    $stranger = Mission::factory()->create();

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $stranger->id,
            'date' => '2026-08-03',
            'durationMinutes' => 60,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['missionId']);
});

test('cannot update another user entry', function (): void {
    $entry = TimeEntry::factory()->create();

    $this->actingAs(User::factory()->create())
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $entry->mission_id,
            'date' => '2026-08-03',
            'durationMinutes' => 60,
        ])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $entry = TimeEntry::factory()->create();

    $this->putJson("/api/time-entries/{$entry->id}", [
        'missionId' => $entry->mission_id,
        'date' => '2026-08-03',
        'durationMinutes' => 60,
    ])->assertUnauthorized();
});

test('can take an entry off the invoice without touching its duration', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $entry = TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-08-03',
        'duration_minutes' => 180,
    ]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 180,
            'billable' => false,
        ])
        ->assertOk()
        ->assertJsonPath('billable', false)
        ->assertJsonPath('durationMinutes', 180);
});

test('puts an omitted billable flag back to billable, like every other field', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $entry = TimeEntry::factory()->for($mission, 'mission')->nonBillable()->create([
        'user_id' => $user->id,
        'date' => '2026-08-03',
        'duration_minutes' => 180,
    ]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$entry->id}", [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 180,
        ])
        ->assertOk()
        ->assertJsonPath('billable', true);
});

/**
 * @param  callable(TimeEntry, Mission): array<string, mixed>  $change
 */
test('refuses to change what an invoice already bills', function (callable $change): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $otherMission = missionOwnedBy($user);
    $timeEntry = invoicedTimeEntry($user, $mission, invoiceForMission($user, $mission));

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$timeEntry->id}", [
            'missionId' => $mission->id,
            'date' => $timeEntry->date->toDateString(),
            'durationMinutes' => $timeEntry->duration_minutes,
            'billable' => $timeEntry->billable,
            ...$change($timeEntry, $otherMission),
        ])
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_change_invoiced_time_entry'));

    $this->assertDatabaseHas('time_entries', [
        'id' => $timeEntry->id,
        'mission_id' => $mission->id,
        'duration_minutes' => $timeEntry->duration_minutes,
    ]);
})->with([
    'the mission' => [fn (TimeEntry $entry, Mission $other): array => ['missionId' => $other->id]],
    'the date' => [fn (TimeEntry $entry): array => ['date' => $entry->date->subDay()->toDateString()]],
    'the duration' => [fn (TimeEntry $entry): array => ['durationMinutes' => $entry->duration_minutes + 30]],
    'the rounding' => [fn (): array => ['rounding' => EntryRounding::Minute->value]],
    'the billable flag' => [fn (TimeEntry $entry): array => ['billable' => ! $entry->billable]],
]);

test('still annotates tracked time that an invoice bills', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $timeEntry = invoicedTimeEntry($user, $mission, invoiceForMission($user, $mission));

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$timeEntry->id}", [
            'missionId' => $mission->id,
            'date' => $timeEntry->date->toDateString(),
            'durationMinutes' => $timeEntry->duration_minutes,
            'billable' => $timeEntry->billable,
            'note' => 'Rapproché de la facture 2026-014',
        ])
        ->assertOk();
});

test('still moves tracked time that no invoice bills', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $otherMission = missionOwnedBy($user);
    $timeEntry = TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/time-entries/{$timeEntry->id}", [
            'missionId' => $otherMission->id,
            'date' => $timeEntry->date->toDateString(),
            'durationMinutes' => 420,
        ])
        ->assertOk();
});
