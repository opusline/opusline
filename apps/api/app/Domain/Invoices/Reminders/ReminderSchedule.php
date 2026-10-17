<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Reminders;

use App\Domain\Invoices\Enums\ReminderFrequency;
use Carbon\CarbonImmutable;

/**
 * When an unpaid invoice is reminded about next, from its due date and how
 * many reminders already left: the rhythm is counted, not clocked, so a
 * reminder sent late by hand moves the next one along rather than doubling it.
 */
final class ReminderSchedule
{
    private const int WEEK_DAYS = 7;

    public static function nextOn(ReminderFrequency $frequency, CarbonImmutable $dueOn, int $sentCount): ?CarbonImmutable
    {
        return match ($frequency) {
            ReminderFrequency::OnceDayAfterDue => $sentCount === 0 ? $dueOn->addDay() : null,
            ReminderFrequency::DayThreeAndTen => match ($sentCount) {
                0 => $dueOn->addDays(3),
                1 => $dueOn->addDays(10),
                default => null,
            },
            ReminderFrequency::WeeklyUntilPaid => $dueOn->addDays(self::WEEK_DAYS * ($sentCount + 1)),
        };
    }
}
