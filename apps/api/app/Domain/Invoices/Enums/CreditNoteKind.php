<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

enum CreditNoteKind: int
{
    /** Cancels the whole invoice: its lines taken back as they were. */
    case Full = 0;
    /** Corrects a part of it — a discount, a line too many, a wrong price; the invoice stays valid. */
    case Partial = 1;
    /** Cancels what is left to pay on it. */
    case Balance = 2;
}
