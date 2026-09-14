<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/** The journal's third tile: what the subscriptions still debiting cost, spread evenly over the year. */
class ExpensesSubscriptionsData extends Data
{
    public function __construct(
        public MoneyData $monthlyHt,
        public MoneyData $monthlyTtc,
        public MoneyData $yearlyHt,
        public MoneyData $yearlyTtc,
        public int $count,
        public int $annualCount,
    ) {}
}
