<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Data;

class DecideQuoteData extends Data
{
    public function __construct(
        /** The day the client answered; today when omitted. */
        #[DateFormat('Y-m-d')]
        public ?string $decidedOn = null,
    ) {}
}
