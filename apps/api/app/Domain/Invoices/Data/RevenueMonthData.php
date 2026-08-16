<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * One bar of the monthly chart.
 */
class RevenueMonthData extends Data
{
    public function __construct(
        public string $month,
        public MoneyData $total,
        /** Whether the month belongs to the period on show — the orange window. */
        public bool $inPeriod,
        /**
         * Share of the window's tallest month, in basis points. The bar height is
         * money arithmetic, so the API does it rather than the frontend.
         */
        public int $shareBp,
    ) {}
}
