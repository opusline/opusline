<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Models\SubscriptionAmount;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class SubscriptionAmountData extends Data
{
    public function __construct(
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $effectiveFrom,
        public MoneyData $amountHt,
    ) {}

    public static function fromModel(SubscriptionAmount $amount): self
    {
        return new self(effectiveFrom: $amount->effective_from, amountHt: MoneyData::fromMoney($amount->amount_ht_cents));
    }
}
