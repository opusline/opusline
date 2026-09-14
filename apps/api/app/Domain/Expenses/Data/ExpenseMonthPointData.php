<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

class ExpenseMonthPointData extends Data
{
    public function __construct(
        /** `Y-m`. */
        public string $month,
        public MoneyData $ht,
        public MoneyData $ttc,
    ) {}
}
