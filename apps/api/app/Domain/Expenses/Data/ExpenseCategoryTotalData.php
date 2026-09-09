<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

class ExpenseCategoryTotalData extends Data
{
    public function __construct(
        public ExpenseCategory $category,
        public MoneyData $ht,
        public MoneyData $ttc,
        /** This category's share of the month's largest one, for the bar. */
        public int $shareBp,
    ) {}
}
