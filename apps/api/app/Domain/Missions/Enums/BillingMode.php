<?php

declare(strict_types=1);

namespace App\Domain\Missions\Enums;

enum BillingMode: int
{
    case Daily = 0;
    case Hourly = 1;
}
