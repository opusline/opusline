<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

/**
 * Both dates are optional so a correction names only the one that was wrong.
 * "Neither" is refused by CorrectInvoiceDates rather than here: laravel-data
 * derives rules only for the keys a payload carries, so a required_without pair
 * would never fire on the empty body it exists to catch.
 */
class CorrectInvoiceDatesData extends Data
{
    public function __construct(
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public ?string $sentOn = null,
        /**
         * Moving this shifts revenue between declaration periods: URSSAF and TVA are
         * cash-basis. Editable on purpose, because corrections happen.
         */
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public ?string $paidOn = null,
    ) {}
}
