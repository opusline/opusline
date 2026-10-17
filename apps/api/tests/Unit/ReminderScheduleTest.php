<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\ReminderFrequency;
use App\Domain\Invoices\Reminders\ReminderSchedule;
use Carbon\CarbonImmutable;

test('counts the next reminder from the due date and what already left', function (ReminderFrequency $frequency, int $sent, ?string $expected): void {
    $next = ReminderSchedule::nextOn($frequency, CarbonImmutable::parse('2026-08-31'), $sent);

    expect($next?->toDateString())->toBe($expected);
})->with([
    'once: the day after' => [ReminderFrequency::OnceDayAfterDue, 0, '2026-09-01'],
    'once: never twice' => [ReminderFrequency::OnceDayAfterDue, 1, null],
    'days 3 and 10: first' => [ReminderFrequency::DayThreeAndTen, 0, '2026-09-03'],
    'days 3 and 10: second' => [ReminderFrequency::DayThreeAndTen, 1, '2026-09-10'],
    'days 3 and 10: done' => [ReminderFrequency::DayThreeAndTen, 2, null],
    'weekly: first' => [ReminderFrequency::WeeklyUntilPaid, 0, '2026-09-07'],
    'weekly: fourth' => [ReminderFrequency::WeeklyUntilPaid, 3, '2026-09-28'],
]);
