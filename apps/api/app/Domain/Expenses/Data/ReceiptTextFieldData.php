<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ReceiptFieldConfidence;
use Spatie\LaravelData\Data;

class ReceiptTextFieldData extends Data
{
    public function __construct(
        public string $value,
        public ReceiptFieldConfidence $confidence,
    ) {}
}
