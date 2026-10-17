<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/** Why the credit note exists; printed on it, with the optional detail. */
enum CreditNoteReason: int
{
    case BillingError = 0;
    case ServiceCancelled = 1;
    case CommercialGesture = 2;
    case Other = 3;
}
