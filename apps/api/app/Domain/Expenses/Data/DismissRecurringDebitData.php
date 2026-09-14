<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

/** The detected debit as the banner showed it; its fingerprint is what gets remembered. */
class DismissRecurringDebitData extends Data
{
    public function __construct(
        #[StringType, Min(1), Max(255)]
        public string $label,
        public MoneyData $amount,
    ) {}
}
