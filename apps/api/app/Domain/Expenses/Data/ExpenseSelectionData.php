<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * The rows a bulk action targets. Ownership is checked by the action rather
 * than here: a set-level exists rule runs before the items are typed, and a
 * nested array would crash it.
 */
class ExpenseSelectionData extends Data
{
    /**
     * The bulk bar can only ever select one month of the journal, and the ids
     * reach `whereIn` unsplit: an unbounded body walks straight into Postgres'
     * 65 535 bind parameters and comes back as a 500.
     */
    public const int MAX_SELECTION = 500;

    /**
     * @param  list<int>  $expenseIds
     */
    public function __construct(
        #[ArrayType, Min(1), Max(self::MAX_SELECTION)]
        public array $expenseIds,
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
