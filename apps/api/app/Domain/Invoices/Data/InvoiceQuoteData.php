<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\QuoteBilling;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Data;

class InvoiceQuoteData extends Data
{
    public function __construct(
        #[Enum(QuoteBilling::class)]
        public QuoteBilling $billing,
    ) {}
}
