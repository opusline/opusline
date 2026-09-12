<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

class DeclarationHistoryVatData extends Data
{
    public function __construct(
        /** Case 32 — zero on a month that built a credit instead. */
        public MoneyData $due,
        /** Case 25 — the credit the month carried forward. */
        public MoneyData $credit,
        public ?DeclarationCompletionData $completion,
    ) {}
}
