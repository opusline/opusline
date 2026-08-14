<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class PayInvoiceData extends Data
{
    public function __construct(
        /**
         * The date the money landed, not the date you noticed. Cash-basis URSSAF and
         * TVA declarations bucket revenue on this, so a future date would book income
         * into a period that has not happened.
         */
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public string $paidOn,
    ) {}
}
