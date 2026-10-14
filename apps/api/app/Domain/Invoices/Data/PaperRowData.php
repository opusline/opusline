<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

class PaperRowData extends Data
{
    public function __construct(
        public string $label,
        public string $value,
    ) {}
}
