<?php

declare(strict_types=1);

namespace App\Domain\Cra\Calendar;

use Carbon\CarbonImmutable;

/**
 * The public holidays of one country, so a CRA grid can grey out days nobody worked.
 */
interface HolidayProvider
{
    /**
     * Holidays falling inside a range, keyed by `Y-m-d`.
     *
     * @return array<string, string>
     */
    public function between(CarbonImmutable $from, CarbonImmutable $to): array;
}
