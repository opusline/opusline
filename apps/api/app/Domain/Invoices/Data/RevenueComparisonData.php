<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * The previous period, for the trend line under the CA figure.
 */
class RevenueComparisonData extends Data
{
    public function __construct(
        public string $period,
        public MoneyData $total,
        /**
         * Change against the previous period, in basis points (−300 = −3 %).
         * Null when the previous period had nothing to compare against.
         */
        public ?int $changeBp,
    ) {}
}
