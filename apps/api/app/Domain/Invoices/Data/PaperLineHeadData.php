<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

class PaperLineHeadData extends Data
{
    public function __construct(
        public string $description,
        public string $quantity,
        public string $unitPrice,
        public string $vat,
        public string $total,
    ) {}
}
