<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class RefundCreditNoteData extends Data
{
    public function __construct(
        /** The day the transfer left: the cash-basis declarations take the refund off that month. */
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public string $refundedOn,
        /** The debit on the pro account that carried it, when the statement is imported. */
        #[IntegerType]
        public ?int $bankMovementId = null,
    ) {}
}
