<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Calendar\CivilMonth;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Attributes\Validation\AfterOrEqual;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Data;

/** A new price and the day it applies from — past, so a debit already made is re-priced, or future. */
class ChangeSubscriptionAmountData extends Data
{
    public function __construct(
        public MoneyData $amountHt,
        #[DateFormat('Y-m-d'), AfterOrEqual(CivilMonth::EARLIEST_DAY)]
        public string $effectiveFrom,
    ) {}
}
