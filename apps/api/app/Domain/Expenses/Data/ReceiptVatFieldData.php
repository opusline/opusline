<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Enums\ReceiptFieldConfidence;
use Spatie\LaravelData\Data;

class ReceiptVatFieldData extends Data
{
    public function __construct(
        public ExpenseVatTreatment $treatment,
        /** Basis points: 2000 is 20 %. Zero for an exempt purchase. */
        public int $rateBp,
        public ReceiptFieldConfidence $confidence,
    ) {}
}
