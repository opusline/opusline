<?php

declare(strict_types=1);

namespace App\Domain\Cra\Calendar;

use Carbon\CarbonImmutable;
use LogicException;

/**
 * The one place a business country turns into a holiday calendar. Supporting a new
 * country means writing its HolidayProvider and adding its arm here.
 */
class Holidays
{
    /**
     * No country runs two consecutive weeks without a working day, so a hop
     * that long means the calendar itself is wrong rather than the date.
     */
    private const int MAX_HOP_DAYS = 14;

    /**
     * What counts as a working day, decided once for both the counting and the
     * rolling below.
     *
     * @param  array<string, string>  $holidays  keyed `Y-m-d`, as HolidayProvider returns them
     */
    private static function isBusinessDay(array $holidays, CarbonImmutable $date): bool
    {
        return ! $date->isWeekend() && ! isset($holidays[$date->toDateString()]);
    }

    public static function for(string $countryCode): HolidayProvider
    {
        return match ($countryCode) {
            'FR' => new FrenchHolidays,
            default => new NoHolidays,
        };
    }

    /**
     * The working days a range offers — weekdays less public holidays, the French
     * "jours ouvrés". Lives here rather than in a caller so that what counts as a
     * working day is decided in one place, alongside the calendar it depends on.
     */
    public static function businessDaysBetween(
        string $countryCode,
        CarbonImmutable $from,
        CarbonImmutable $to,
    ): int {
        $holidays = self::for($countryCode)->between($from, $to);
        $businessDays = 0;

        for ($date = $from; $date->lessThanOrEqualTo($to); $date = $date->addDay()) {
            if (self::isBusinessDay($holidays, $date)) {
                $businessDays++;
            }
        }

        return $businessDays;
    }

    /**
     * The first working day on or after $date — the roll-forward every French
     * administration applies when a filing deadline lands on a weekend or a
     * jour férié. Returns $date untouched when it is already a working day, so
     * callers can apply it unconditionally.
     */
    public static function nextBusinessDay(string $countryCode, CarbonImmutable $date): CarbonImmutable
    {
        $limit = $date->addDays(self::MAX_HOP_DAYS);
        $holidays = self::for($countryCode)->between($date, $limit);

        for ($candidate = $date; $candidate->lessThanOrEqualTo($limit); $candidate = $candidate->addDay()) {
            if (self::isBusinessDay($holidays, $candidate)) {
                return $candidate;
            }
        }

        throw new LogicException('No working day within '.self::MAX_HOP_DAYS." days of {$date->toDateString()} in {$countryCode}.");
    }
}
