<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * A return marked paid whose debit no imported movement shows yet, at what
 * the provisions carried for it — the amount that leaves the provisions the
 * moment it is marked paid, and that the balance has not lost yet.
 */
class PaidPeriodData extends Data
{
    public function __construct(
        /** The period key its declaration shares: `2026-07`, `2026-Q2` or `2025`. */
        public string $period,
        public MoneyData $amount,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $paidOn,
    ) {}
}
