<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Data;

use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class MonthWorkloadQueryData extends Data
{
    public function __construct(
        /** The civil month the workload covers, as `2026-08`. */
        #[StringType, Regex('/^\d{4}-(0[1-9]|1[0-2])$/')]
        public string $month,
    ) {}
}
