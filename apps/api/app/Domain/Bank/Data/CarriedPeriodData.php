<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/** One closed period the provision still holds money for, net of the payments detected since it closed. */
class CarriedPeriodData extends Data
{
    public function __construct(
        /** The period key its declaration shares: `2026-07`, `2026-Q2` or `2025`. */
        public string $period,
        public MoneyData $amount,
    ) {}
}
