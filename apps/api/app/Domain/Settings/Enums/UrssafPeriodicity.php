<?php

declare(strict_types=1);

namespace App\Domain\Settings\Enums;

use Carbon\CarbonImmutable;

enum UrssafPeriodicity: int
{
    case Monthly = 0;
    case Quarterly = 1;

    /** The last day of the return a collection on $date is declared on. */
    public function returnEnd(CarbonImmutable $date): CarbonImmutable
    {
        return match ($this) {
            self::Monthly => $date->endOfMonth(),
            self::Quarterly => $date->lastOfQuarter(),
        };
    }
}
