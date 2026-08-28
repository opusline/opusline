<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Calendar\CivilMonth;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class SummarizeInvoicesData extends Data
{
    public function __construct(
        /** The month the totals cover, defaulting to the current one. */
        #[StringType, Regex(CivilMonth::EXPRESSION)]
        public ?string $month = null,
    ) {}
}
