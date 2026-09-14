<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Calendar\CivilMonth;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class ListExpensesData extends Data
{
    public function __construct(
        /** The month the journal shows (`2026-07`); omitted, the account's current month. */
        #[StringType, Regex(CivilMonth::EXPRESSION)]
        public ?string $month = null,
    ) {}
}
