<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

class PaperTotalData extends Data
{
    public function __construct(
        public string $label,
        public string $value,
        /** The grand total, printed bold on a tinted row. */
        public bool $emphasis,
    ) {}
}
