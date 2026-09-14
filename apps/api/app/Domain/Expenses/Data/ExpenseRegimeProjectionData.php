<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * Whether declaring real charges would beat the micro-BNC flat abatement —
 * the one question expense tracking answers for a micro-entrepreneur.
 */
class ExpenseRegimeProjectionData extends Data
{
    public function __construct(
        /** This month's HT charges taken as a run rate over a year. */
        public MoneyData $projectedChargesHt,
        /** HT collected over the twelve months ending with the shown one. */
        public MoneyData $annualRevenueHt,
        /** The flat abatement the micro régime grants on that revenue. */
        public MoneyData $abatement,
        public bool $microIsFavourable,
    ) {}
}
