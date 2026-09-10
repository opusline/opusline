<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class SendInvoiceData extends Data
{
    public function __construct(
        /**
         * The day the document left. Omitted, it is the invoice's own issue date —
         * most invoices go out the day they are written — but a draft prepared on
         * Friday and sent on Monday says so, because "when did you send it?" is
         * answered from this history and nowhere else.
         */
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public ?string $sentOn = null,
    ) {}
}
