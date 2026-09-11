<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

/**
 * Every date is optional so a correction names only the one that was wrong.
 * "None of them" is refused by CorrectInvoiceDates rather than here:
 * laravel-data derives rules only for the keys a payload carries, so a
 * required_without group would never fire on the empty body it exists to catch.
 */
class CorrectInvoiceDatesData extends Data
{
    public function __construct(
        /**
         * The day the invoice bears. It is the floor the other two stand on, so an
         * invoice recorded under the wrong one cannot have its send date put right
         * until this moves — which is the whole reason it is correctable.
         */
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public ?string $issuedOn = null,
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
