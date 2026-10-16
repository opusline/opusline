<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Data;

class UnbilledTimeQueryData extends Data
{
    public function __construct(
        #[IntegerType]
        public int $missionId,
        /** A draft being edited: the time it already covers counts as importable again. */
        #[IntegerType]
        public ?int $invoiceId = null,
    ) {}
}
