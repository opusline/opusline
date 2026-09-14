<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Calendar\CivilMonth;
use Spatie\LaravelData\Attributes\Validation\AfterOrEqual;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Data;

class CancelSubscriptionData extends Data
{
    public function __construct(
        /** The last day the subscription debits; omitted, today. */
        #[DateFormat('Y-m-d'), AfterOrEqual(CivilMonth::EARLIEST_DAY)]
        public ?string $cancelledOn = null,
    ) {}
}
