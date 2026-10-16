<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

/** The « Bon pour accord » box a quote ends with. */
class PaperSignatureData extends Data
{
    public function __construct(
        public string $title,
        public string $caption,
    ) {}
}
