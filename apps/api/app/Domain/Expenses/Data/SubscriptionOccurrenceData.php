<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\SubscriptionOccurrenceState;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/** One debit of the twelve-month strip and what became of it. */
class SubscriptionOccurrenceData extends Data
{
    public function __construct(
        /** `2026-07`, `2026-Q3` or `2026`. */
        public string $period,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $debitOn,
        public SubscriptionOccurrenceState $state,
        public ?int $expenseId,
    ) {}
}
