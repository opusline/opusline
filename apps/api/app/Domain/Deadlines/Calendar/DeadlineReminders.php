<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Calendar;

/**
 * When a deadline starts speaking up, in days before it falls due.
 *
 * Fixed rather than configurable: two warnings and the day itself is what a
 * reminder needs to be, and a setting nobody changes is a setting nobody
 * should have had to see. Listed furthest-first, so the last lead a date has
 * reached is the most recent one.
 *
 * One list, in one unit: the in-app feed counts in days and the ICS alarms in
 * minutes, and a comment claiming the two agree is not a constraint.
 */
final readonly class DeadlineReminders
{
    /** @var list<int> */
    public const array LEAD_DAYS = [7, 1, 0];

    /**
     * The same leads as ICS alarm offsets. The day-of lead is dropped: an alarm
     * at the very start of an all-day event is what the event already is.
     *
     * @return list<int>
     */
    public static function alertMinutesBefore(): array
    {
        $minutes = [];

        foreach (self::LEAD_DAYS as $days) {
            if ($days > 0) {
                $minutes[] = $days * 24 * 60;
            }
        }

        return $minutes;
    }
}
