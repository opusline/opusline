<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\RevenueBasis;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class SummarizeRevenueData extends Data
{
    public function __construct(
        /**
         * The period the totals cover: a month (`2026-07`), a quarter (`2026-Q3`)
         * or a year (`2026`). Omitted, the current month is shown — or, when it has
         * no activity yet, the most recent month that does.
         */
        #[StringType, Regex('/^\d{4}(-(0[1-9]|1[0-2])|-Q[1-4])?$/')]
        public ?string $period = null,
        /** Which revenue to read, defaulting to the invoiced basis. */
        #[Enum(RevenueBasis::class)]
        public ?RevenueBasis $basis = null,
    ) {}
}
