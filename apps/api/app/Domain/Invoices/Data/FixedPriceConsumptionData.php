<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\FixedPriceBudgetState;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * What a forfait's tracked time has cost it, read at the mission's reference daily
 * rate. Absent — not zeroed — when no reference rate is set: without one the question
 * has no answer, and a zero would read as "nothing consumed yet".
 */
class FixedPriceConsumptionData extends Data
{
    public function __construct(
        public MoneyData $referenceDailyRate,
        /** Billable time tracked since the mission began, in the increment it rounds to. */
        public float $trackedDays,
        /** trackedDays at the reference rate — what the work done would have billed. */
        public MoneyData $consumed,
        public int $consumedShareBp,
        /** How many days the fixed price pays for: forfait ÷ reference rate. */
        public float $coveredDays,
        /** coveredDays − trackedDays. Negative once the forfait has been overrun. */
        public float $remainingDays,
        /** Zero until consumed passes the forfait; what it costs you after that. */
        public MoneyData $overrun,
        public FixedPriceBudgetState $state,
    ) {}
}
