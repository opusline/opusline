<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * What a fixed-price mission has cost to deliver, against what it was meant to.
 *
 * Deliberately not what it has billed — that is SummarizeMissionBilling's answer,
 * read from invoices. This block is read from tracked time, and the two never
 * meet: no figure here is revenue, and none of them reaches an invoice.
 *
 * It rides on MissionRevenueData rather than its own endpoint because the clients
 * listing needs it per mission to flag the ones over budget, and that listing
 * already folds every mission's revenue in one pass.
 */
class MissionForfaitData extends Data
{
    public function __construct(
        /**
         * Effort the price buys at the mission's target day rate, in minutes.
         * Null until a target is set — without one there is no budget to consume,
         * and a zero would read as "all of it, already spent".
         */
        public ?int $budgetMinutes,
        /**
         * Time tracked on the mission, non-billable entries included: on a fixed
         * price nothing is separately billable, and effort you chose not to bill
         * still came out of the same budget.
         */
        public int $trackedMinutes,
        /** Share of the budget consumed; null for the same reason budgetMinutes is. */
        public ?int $consumedShareBp,
        /**
         * What the mission has actually earned per day so far — invoiced divided by
         * days tracked. Null until time exists: a rate over no days is not zero,
         * it is unknown.
         */
        public ?MoneyData $effectiveRate,
    ) {}
}
