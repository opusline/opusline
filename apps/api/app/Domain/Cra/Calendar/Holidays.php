<?php

declare(strict_types=1);

namespace App\Domain\Cra\Calendar;

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
}
