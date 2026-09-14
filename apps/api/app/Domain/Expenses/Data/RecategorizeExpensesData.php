<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ExpenseCategory;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/** The bulk bar's « Catégorie » action; ids are checked like ExpenseSelectionData's. */
class RecategorizeExpensesData extends Data
{
    /**
     * @param  list<int>  $expenseIds
     */
    public function __construct(
        #[ArrayType, Min(1)]
        public array $expenseIds,
        #[Enum(ExpenseCategory::class)]
        public ExpenseCategory $category,
    ) {}

    /**
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return ExpenseSelectionData::rules();
    }
}
