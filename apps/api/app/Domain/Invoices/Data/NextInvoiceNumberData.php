<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

/**
 * A suggestion, never an assignment: the authoritative number is the one the
 * tool that issued the invoice printed on it.
 */
class NextInvoiceNumberData extends Data
{
    public function __construct(
        public string $number,
        public string $format,
    ) {}
}
