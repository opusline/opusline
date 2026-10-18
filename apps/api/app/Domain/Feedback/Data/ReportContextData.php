<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

/** The technical context the account saw and agreed to send with a report. */
class ReportContextData extends Data
{
    public function __construct(
        #[StringType, Max(255)]
        public string $route,
        #[StringType, Max(255)]
        public string $browser,
        #[StringType, Max(16)]
        public string $locale,
    ) {}
}
