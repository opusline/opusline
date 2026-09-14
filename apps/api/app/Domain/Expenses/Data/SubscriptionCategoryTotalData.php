<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

class SubscriptionCategoryTotalData extends Data
{
    public function __construct(
        public ExpenseCategory $category,
        public MoneyData $yearlyHt,
    ) {}
}
