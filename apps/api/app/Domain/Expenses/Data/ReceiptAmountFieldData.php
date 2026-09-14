<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ReceiptFieldConfidence;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

class ReceiptAmountFieldData extends Data
{
    public function __construct(
        public MoneyData $value,
        public ReceiptFieldConfidence $confidence,
    ) {}
}
