<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class BankProvisionData extends Data
{
    public function __construct(
        public MoneyData $amount,
        /** Null for TVA, which sums each invoice's actual rate instead of applying one. */
        public ?int $rateBp,
        /**
         * The last day of the accrual window the amount was collected over —
         * the period the régime declares, not a filing deadline: those follow
         * published calendars this app does not model.
         */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $periodEnd,
    ) {}
}
