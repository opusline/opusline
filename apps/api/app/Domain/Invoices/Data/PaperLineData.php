<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

class PaperLineData extends Data
{
    public function __construct(
        public string $label,
        public ?string $detail,
        public string $quantity,
        public string $unitPrice,
        public string $vat,
        public string $total,
    ) {}
}
