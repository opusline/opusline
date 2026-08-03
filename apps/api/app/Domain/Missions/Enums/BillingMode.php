<?php

declare(strict_types=1);

namespace App\Domain\Missions\Enums;

enum BillingMode: string
{
    case Daily = 'daily';
    case Hourly = 'hourly';
}
