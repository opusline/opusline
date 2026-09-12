<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * The tab's four tiles, over the subscriptions still debiting (neither
 * paused nor cancelled). A quarterly subscription counts as monthly at a
 * third of its debit.
 */
class SubscriptionKpisData extends Data
{
    public function __construct(
        /** What the monthly and quarterly subscriptions cost per month, TTC. */
        public MoneyData $monthlyTtc,
        public int $monthlyCount,
        /** What the annual subscriptions cost per year, TTC. */
        public MoneyData $yearlyTtc,
        public int $annualCount,
        /** How many annual subscriptions are spread over the year on the compte pro, and for how much a month. */
        public int $provisionedCount,
        public MoneyData $provisionedPerMonth,
        public MoneyData $recoverableVatPerYear,
        /** TVA self-assessed under reverse charge per year — due in full on the CA3; only its professional share sits in recoverableVatPerYear. */
        public MoneyData $reverseChargedVatPerYear,
    ) {}
}
