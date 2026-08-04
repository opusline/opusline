<?php

declare(strict_types=1);

namespace App\Domain\Missions\Enums;

enum BillingMode: int
{
    case Daily = 0;
    case Hourly = 1;
    case Fixed = 2;

    public function resolveRounding(?EntryRounding $requested): ?EntryRounding
    {
        if ($this === self::Fixed) {
            return null;
        }

        return $requested ?? EntryRounding::Half;
    }
}
