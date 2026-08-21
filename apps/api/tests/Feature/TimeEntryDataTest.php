<?php

declare(strict_types=1);

use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Data\TimeEntryData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

function entryOn(Mission $mission, int $minutes): TimeEntry
{
    return TimeEntry::factory()->for($mission, 'mission')->create([
        'date' => '2026-08-03',
        'duration_minutes' => $minutes,
        'note' => 'Revue de specs',
    ]);
}

test('maps a time entry to its data shape', function (): void {
    $mission = missionOwnedBy(User::factory()->create());
    $entry = entryOn($mission, 210);

    $data = TimeEntryData::from($entry);

    expect($data->id)->toBe($entry->id)
        ->and($data->missionId)->toBe($mission->id)
        ->and($data->date->toDateString())->toBe('2026-08-03')
        ->and($data->durationMinutes)->toBe(210)
        ->and($data->note)->toBe('Revue de specs');
});

test('values a daily mission entry in day fractions only', function (): void {
    $data = TimeEntryData::from(entryOn(missionOwnedBy(User::factory()->create()), 180));

    expect($data->valuedDayFraction)->toBe(0.5)
        ->and($data->valuedMinutes)->toBeNull();
});

test('values an hourly mission entry in minutes only', function (): void {
    $mission = missionOwnedBy(User::factory()->create(), fn ($factory) => $factory->hourly());
    $data = TimeEntryData::from(entryOn($mission, 67));

    expect($data->valuedMinutes)->toBe(90)
        ->and($data->valuedDayFraction)->toBeNull();
});

test('values a fixed price mission entry at its own rounding', function (): void {
    $mission = missionOwnedBy(User::factory()->create(), fn ($factory) => $factory->fixed());
    $data = TimeEntryData::from(entryOn($mission, 100));

    expect($data->valuedDayFraction)->toBe(0.5)
        ->and($data->valuedMinutes)->toBeNull();
});

test('values a minute rounded daily mission exactly', function (): void {
    $mission = missionOwnedBy(
        User::factory()->create(),
        fn ($factory) => $factory->state(['rounding' => EntryRounding::Minute]),
    );

    expect(TimeEntryData::from(entryOn($mission, 180))->valuedDayFraction)->toBe(180 / 420);
});

test('serializes the date as a calendar day', function (): void {
    $mission = missionOwnedBy(User::factory()->create());

    expect(TimeEntryData::from(entryOn($mission, 210))->toArray()['date'])->toBe('2026-08-03');
});

test('carries the entry billable flag', function (): void {
    $mission = missionOwnedBy(User::factory()->create());
    $billable = TimeEntry::factory()->for($mission, 'mission')->create();
    $tracked = TimeEntry::factory()->for($mission, 'mission')->nonBillable()->create();

    expect(TimeEntryData::from($billable)->billable)->toBeTrue()
        ->and(TimeEntryData::from($tracked)->billable)->toBeFalse();
});
