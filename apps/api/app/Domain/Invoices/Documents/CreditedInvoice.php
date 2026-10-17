<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Documents;

use Carbon\CarbonImmutable;

/** The invoice a credit note relates to, as the credit note must name it. */
final readonly class CreditedInvoice
{
    public function __construct(
        public string $number,
        public CarbonImmutable $issuedOn,
    ) {}
}
