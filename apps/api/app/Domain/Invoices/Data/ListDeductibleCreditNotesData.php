<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Data;

class ListDeductibleCreditNotesData extends Data
{
    public function __construct(
        #[IntegerType]
        public int $clientId,
        /** The draft being edited: what it already claims is offered again. */
        #[IntegerType]
        public ?int $invoiceId = null,
    ) {}
}
