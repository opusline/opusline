<?php

declare(strict_types=1);

namespace App\Domain\Settings\Enums;

enum UrssafPeriodicity: int
{
    case Monthly = 0;
    case Quarterly = 1;
}
