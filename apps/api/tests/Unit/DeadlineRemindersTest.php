<?php

declare(strict_types=1);

use App\Domain\Deadlines\Calendar\DeadlineReminders;
use Carbon\CarbonImmutable;

test('a deadline reaches a lead on its reminder days and on no other', function (string $today, ?int $leadDays): void {
    $dueOn = CarbonImmutable::parse('2026-08-31');

    expect(DeadlineReminders::leadReachedOn($dueOn, CarbonImmutable::parse($today)))->toBe($leadDays);
})->with([
    'eight days before' => ['2026-08-23', null],
    'a week before' => ['2026-08-24', 7],
    'six days before' => ['2026-08-25', null],
    'the day before' => ['2026-08-30', 1],
    'the day itself' => ['2026-08-31', 0],
    'the day after' => ['2026-09-01', null],
]);
