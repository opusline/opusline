<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/** One line of the « prochains prélèvements » rail: a debit, or a month's provision of an annual one. */
class UpcomingDebitData extends Data
{
    public function __construct(
        public int $subscriptionId,
        public string $supplier,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $dueOn,
        public MoneyData $amountTtc,
        public SubscriptionPeriodicity $periodicity,
        public bool $isProvision,
    ) {}
}
