<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Data;

use App\Domain\Shared\Calendar\CivilMonth;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class MonthWorkloadQueryData extends Data
{
    public function __construct(
        /** The civil month the workload covers, as `2026-08`. */
        #[StringType, Regex(CivilMonth::EXPRESSION)]
        public string $month,
    ) {}
}
