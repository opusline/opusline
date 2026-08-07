<?php

declare(strict_types=1);

use App\Domain\Missions\Enums\EntryRounding;

test('values a duration by rounding up to the increment', function (EntryRounding $rounding, int $minutes, int $expected): void {
    expect($rounding->valueMinutes($minutes))->toBe($expected);
})->with([
    'an exact half hour stays put' => [EntryRounding::Half, 30, 30],
    'a started half hour is a billed half hour' => [EntryRounding::Half, 67, 90],
    'a started quarter hour is a billed quarter hour' => [EntryRounding::Quarter, 67, 75],
    'an exact quarter hour stays put' => [EntryRounding::Quarter, 75, 75],
    'minute rounding values exactly' => [EntryRounding::Minute, 67, 67],
    'a single minute still bills a full increment' => [EntryRounding::Half, 1, 30],
]);

test('values a duration as a fraction of a workday', function (EntryRounding $rounding, int $minutes, float $expected): void {
    expect($rounding->valueDayFraction($minutes, workdayMinutes: 420))->toBe($expected);
})->with([
    'a full workday is a day' => [EntryRounding::Half, 420, 1.0],
    'half a workday is half a day' => [EntryRounding::Half, 210, 0.5],
    'a three hour morning counts as a half day' => [EntryRounding::Half, 180, 0.5],
    'five hours count as a full day' => [EntryRounding::Half, 300, 1.0],
    'quarter rounding keeps three quarters' => [EntryRounding::Quarter, 315, 0.75],
    'quarter rounding rounds a short morning up' => [EntryRounding::Quarter, 100, 0.25],
    'a full workday is one day at quarter rounding too' => [EntryRounding::Quarter, 420, 1.0],
    'minute rounding values exactly' => [EntryRounding::Minute, 180, 180 / 420],
    'exactly half a day stays half' => [EntryRounding::Half, 210, 0.5],
    'one minute past half a day bills a full day' => [EntryRounding::Half, 211, 1.0],
    'two minutes past half a day bills a full day' => [EntryRounding::Half, 212, 1.0],
    'exactly a quarter day stays a quarter' => [EntryRounding::Quarter, 105, 0.25],
    'one minute past a quarter day bills a half' => [EntryRounding::Quarter, 106, 0.5],
]);
