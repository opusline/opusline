<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/**
 * What happens to the credit note's amount. An unpaid invoice simply owes less
 * (or nothing); money the client already paid goes back to them, by transfer or
 * off a later invoice.
 */
enum CreditNoteSettlement: int
{
    case CancelsInvoice = 0;
    case ReducesBalance = 1;
    case Refund = 2;
    case DeductFromNextInvoice = 3;

    /** Whether the client is owed money back once the credit note is issued. */
    public function returnsMoney(): bool
    {
        return $this === self::Refund || $this === self::DeductFromNextInvoice;
    }
}
