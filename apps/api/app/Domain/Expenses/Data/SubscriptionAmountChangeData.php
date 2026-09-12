<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/** The latest price change of a subscription: what it cost, what it costs, since when. */
class SubscriptionAmountChangeData extends Data
{
    public function __construct(
        public int $subscriptionId,
        public string $supplier,
        public MoneyData $before,
        public MoneyData $after,
        /** after − before as a share of before, in basis points; negative for a price drop. */
        public int $changeBp,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $since,
    ) {}
}
