<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\InvoiceForecastBucket;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

class InvoiceForecastData extends Data
{
    public function __construct(
        public InvoiceForecastBucket $bucket,
        public MoneyData $amount,
        /**
         * Share of the largest bucket, in basis points. The bar width is money
         * arithmetic, so the API does it rather than the frontend.
         */
        public int $shareBp,
    ) {}
}
