<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ExpenseCategory;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * The bulk bar's « Catégorie » action. Ownership of the ids is checked by
 * RecategorizeExpenses rather than here: a set-level exists rule runs before
 * the items are typed, and a nested array would crash it.
 */
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
     * Array items cannot be typed by attribute.
     *
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return [
            'expenseIds.*' => ['integer'],
        ];
    }
}
