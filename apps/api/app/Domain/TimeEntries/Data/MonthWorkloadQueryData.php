<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Data;

use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class MonthWorkloadQueryData extends Data
{
    public function __construct(
        /**
         * The civil month the workload covers, as `2026-08`.
         *
         * The year is bounded rather than left to `\d{4}` because the holiday
         * provider memoizes every year it is asked for in a static that outlives
         * the request on an Octane worker. This narrows that table to a plausible
         * range; it does not close it, since CreateCraData still reaches the same
         * memo with an unbounded `Y-m`.
         */
        #[StringType, Regex('/^(19|20)\d{2}-(0[1-9]|1[0-2])$/')]
        public string $month,
    ) {}
}
