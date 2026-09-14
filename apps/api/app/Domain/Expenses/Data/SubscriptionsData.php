<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/** The Abonnements tab in one payload; every write answers with it. */
class SubscriptionsData extends Data
{
    /**
     * @param  list<SubscriptionData>  $subscriptions  the ones with a next debit first, then the paused, the ended last
     * @param  list<UpcomingDebitData>  $upcoming  the next thirty days, soonest first
     * @param  list<SubscriptionCategoryTotalData>  $categories  the year's HT by category, largest first
     * @param  list<SubscriptionAmountChangeData>  $amountChanges  latest first
     * @param  list<RecurringDebitData>  $detected  recurring debits no subscription explains, the most recent first
     */
    public function __construct(
        public SubscriptionKpisData $kpis,
        #[DataCollectionOf(SubscriptionData::class)]
        public array $subscriptions,
        #[DataCollectionOf(UpcomingDebitData::class)]
        public array $upcoming,
        #[DataCollectionOf(SubscriptionCategoryTotalData::class)]
        public array $categories,
        /** What a year of the subscriptions still debiting costs, HT. */
        public MoneyData $yearlyHt,
        #[DataCollectionOf(SubscriptionAmountChangeData::class)]
        public array $amountChanges,
        #[DataCollectionOf(RecurringDebitData::class)]
        public array $detected,
    ) {}
}
