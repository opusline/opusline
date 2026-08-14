<?php

declare(strict_types=1);

namespace App\Domain\Cra\Calendar;

use Carbon\CarbonImmutable;

/**
 * For countries whose holiday calendar is not implemented: the CRA grid greys out
 * nothing, and every weekday stays an ordinary clickable day.
 */
class NoHolidays implements HolidayProvider
{
    public function between(CarbonImmutable $from, CarbonImmutable $to): array
    {
        return [];
    }
}
