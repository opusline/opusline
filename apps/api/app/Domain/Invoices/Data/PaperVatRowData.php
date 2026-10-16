<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

class PaperVatRowData extends Data
{
    public function __construct(
        public string $base,
        public string $rate,
        public string $amount,
    ) {}
}
