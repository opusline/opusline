<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Data;

class SummarizeInvoicesData extends Data
{
    public function __construct(
        /** The month the totals cover, defaulting to the current one. */
        #[DateFormat('Y-m')]
        public ?string $month = null,
    ) {}
}
