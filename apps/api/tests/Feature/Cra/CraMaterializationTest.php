<?php

declare(strict_types=1);

use App\Domain\Cra\Actions\MaterializeCraDays;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\TimeEntries\Factories\TimeEntryFactory;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

test('values a day from the minutes tracked on it', function (array $minutes, EntryRounding $rounding, int $expectedBp): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user, fn ($factory) => $factory->state(['rounding' => $rounding]));

    foreach ($minutes as $tracked) {
        trackedDay($user, $mission, '2026-07-06', minutes: $tracked);
    }

    $grid = app(MaterializeCraDays::class)->handle($mission, CarbonImmutable::parse('2026-07-01'));

    expect($grid)->toBe(['2026-07-06' => $expectedBp]);
})->with([
    'a full workday is a whole day' => [[420], EntryRounding::Half, 10_000],
    'a half workday is half a day' => [[210], EntryRounding::Half, 5_000],
    'two halves on one day make a whole one' => [[210, 210], EntryRounding::Half, 10_000],
    'three one-hour entries are half a day, not three halves' => [[60, 60, 60], EntryRounding::Half, 5_000],
    'four ten-minute entries are one quarter, not four' => [[10, 10, 10, 10], EntryRounding::Quarter, 2_500],
    'overtime is capped: a client is billed days, not hours' => [[540], EntryRounding::Minute, 10_000],
]);

test('leaves non-billable time off the grid, since the total is what the client owes', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    trackedDay($user, $mission, '2026-07-06', configure: fn (TimeEntryFactory $factory): TimeEntryFactory => $factory->nonBillable());

    $grid = app(MaterializeCraDays::class)->handle($mission, CarbonImmutable::parse('2026-07-01'));

    expect($grid)->toBe([]);
});

test('ignores days outside the month', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    trackedDay($user, $mission, '2026-06-30');
    trackedDay($user, $mission, '2026-07-01');
    trackedDay($user, $mission, '2026-08-01');

    $grid = app(MaterializeCraDays::class)->handle($mission, CarbonImmutable::parse('2026-07-15'));

    expect($grid)->toBe(['2026-07-01' => 10_000]);
});

test('ignores time tracked on another mission', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    $other = missionOwnedBy($user);
    trackedDay($user, $other, '2026-07-06');

    $grid = app(MaterializeCraDays::class)->handle($mission, CarbonImmutable::parse('2026-07-01'));

    expect($grid)->toBe([]);
});

test('rounds the day by the mission increment, ignoring per-entry overrides', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    trackedDay(
        $user,
        $mission,
        '2026-07-06',
        minutes: 105,
        configure: fn (TimeEntryFactory $factory) => $factory->state(['rounding' => EntryRounding::Quarter]),
    );

    $grid = app(MaterializeCraDays::class)->handle($mission, CarbonImmutable::parse('2026-07-01'));

    // A day needs one rounding, and it is the mission's: per-entry overrides exist to
    // bill an invoice line, not to split a calendar day into differently-rounded halves.
    expect($grid)->toBe(['2026-07-06' => 5_000]);
});

test('returns the days in calendar order', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    trackedDay($user, $mission, '2026-07-20');
    trackedDay($user, $mission, '2026-07-06');
    trackedDay($user, $mission, '2026-07-13');

    $grid = app(MaterializeCraDays::class)->handle($mission, CarbonImmutable::parse('2026-07-01'));

    expect(array_keys($grid))->toBe(['2026-07-06', '2026-07-13', '2026-07-20']);
});
