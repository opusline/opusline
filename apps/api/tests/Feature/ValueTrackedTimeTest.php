<?php

declare(strict_types=1);

use App\Domain\Invoices\Actions\ValueTrackedTime;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Currency;
use App\Domain\TimeEntries\Models\TimeEntry;
use Cknow\Money\Money;

function pricedMission(BillingMode $billingMode, ?int $rateCents, EntryRounding $rounding): Mission
{
    $mission = new Mission;
    // Must precede rate_cents: MoneyIntegerCast reads it to build the Money.
    $mission->currency = Currency::EUR->value;
    $mission->billing_mode = $billingMode;
    $mission->rate_cents = $rateCents;
    $mission->rounding = $rounding;

    return $mission;
}

function trackedEntry(int $durationMinutes): TimeEntry
{
    $entry = new TimeEntry;
    $entry->duration_minutes = $durationMinutes;
    $entry->rounding = null;

    return $entry;
}

/** The workday most French contracts run on: seven hours, which divides no rate evenly. */
const SEVEN_HOUR_DAY = 420;

test('values an hourly entry to the cent', function (int $rateCents, EntryRounding $rounding, int $minutes, int $expected): void {
    $measured = (new ValueTrackedTime)->measure(
        pricedMission(BillingMode::Hourly, $rateCents, $rounding),
        trackedEntry($minutes),
        SEVEN_HOUR_DAY,
    );

    expect((int) $measured['value']->getAmount())->toBe($expected);
})->with([
    'a whole hour' => [5_500, EntryRounding::Minute, 60, 5_500],
    'seven minutes at minute rounding' => [5_500, EntryRounding::Minute, 7, 642],
    'rounds up at the half-cent midpoint' => [1, EntryRounding::Minute, 30, 1],
    'rounds down below the midpoint' => [1, EntryRounding::Minute, 29, 0],
    'a started quarter hour bills the whole quarter' => [6_000, EntryRounding::Quarter, 67, 7_500],
    'a started half hour bills the whole half' => [6_000, EntryRounding::Half, 31, 6_000],
]);

test('values a day-billed entry from the exact fraction, never from the day count', function (int $rateCents, EntryRounding $rounding, int $minutes, int $expected): void {
    $measured = (new ValueTrackedTime)->measure(
        pricedMission(BillingMode::Daily, $rateCents, $rounding),
        trackedEntry($minutes),
        SEVEN_HOUR_DAY,
    );

    expect((int) $measured['value']->getAmount())->toBe($expected);
})->with([
    'a full day' => [55_000, EntryRounding::Minute, SEVEN_HOUR_DAY, 55_000],
    // 100/420 of a day has no exact float.
    'a workday that does not divide the duration' => [55_000, EntryRounding::Minute, 100, 13_095],
    'rounds up at the half-cent midpoint' => [3, EntryRounding::Half, 210, 2],
    'a started quarter day bills the whole quarter' => [55_000, EntryRounding::Quarter, 1, 13_750],
    'a started half day bills the whole half' => [55_000, EntryRounding::Half, 1, 27_500],
]);

test('a day longer than the workday still bills one day', function (): void {
    $measured = (new ValueTrackedTime)->measure(
        pricedMission(BillingMode::Daily, 55_000, EntryRounding::Minute),
        trackedEntry(9 * 60),
        SEVEN_HOUR_DAY,
    );

    expect((int) $measured['value']->getAmount())->toBe(55_000)
        ->and($measured['days'])->toBe(1.0);
});

test('a mission with no rate prices nothing', function (): void {
    $mission = pricedMission(BillingMode::Daily, null, EntryRounding::Half);
    $valueTrackedTime = new ValueTrackedTime;

    expect($valueTrackedTime->pricesTime($mission))->toBeFalse();

    $measured = $valueTrackedTime->measure($mission, trackedEntry(210), SEVEN_HOUR_DAY);

    expect((int) $measured['value']->getAmount())->toBe(0)
        ->and($measured['days'])->toBe(0.0)
        ->and($measured['minutes'])->toBe(0);
});

test('a fixed price prices nothing, yet still counts the days it ate', function (): void {
    $mission = pricedMission(BillingMode::Fixed, 1_000_000, EntryRounding::Half);
    $valueTrackedTime = new ValueTrackedTime;

    expect($valueTrackedTime->pricesTime($mission))->toBeFalse();
    expect((int) $valueTrackedTime->measure($mission, trackedEntry(210), SEVEN_HOUR_DAY)['value']->getAmount())->toBe(0);
    expect($valueTrackedTime->quantityFor($mission, trackedEntry(210), SEVEN_HOUR_DAY))->toBe(['days' => 0.5, 'minutes' => null]);
});

test('a forfait consumes its budget at the reference rate, not at its own price', function (): void {
    $consumed = (new ValueTrackedTime)->consumeAtReferenceRate(
        pricedMission(BillingMode::Fixed, 1_000_000, EntryRounding::Minute),
        trackedEntry(100),
        SEVEN_HOUR_DAY,
        new Money(55_000, 'EUR'),
    );

    expect((int) $consumed['value']->getAmount())->toBe(13_095);
});

test('an hourly entry reports its billed minutes and no day fraction', function (): void {
    $measured = (new ValueTrackedTime)->measure(
        pricedMission(BillingMode::Hourly, 6_000, EntryRounding::Quarter),
        trackedEntry(67),
        SEVEN_HOUR_DAY,
    );

    expect($measured['minutes'])->toBe(75)
        ->and($measured['days'])->toBe(0.0);
});
