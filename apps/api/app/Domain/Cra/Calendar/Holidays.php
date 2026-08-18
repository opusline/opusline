<?php

declare(strict_types=1);

namespace App\Domain\Cra\Calendar;

use Carbon\CarbonImmutable;

/**
 * The one place a business country turns into a holiday calendar. Supporting a new
 * country means writing its HolidayProvider and adding its arm here.
 */
class Holidays
{
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
            if (! $date->isWeekend() && ! isset($holidays[$date->toDateString()])) {
                $businessDays++;
            }
        }

        return $businessDays;
    }
}
