<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

enum InvoiceEventKind: int
{
    case Created = 0;
    case Sent = 1;
    case Reminded = 2;
    /** The payment that completed the invoice landed. */
    case Paid = 3;
    case Updated = 4;
    /** E-mailed to the client from Opusline; the note names the recipients. */
    case Emailed = 5;
    /** A payment landed that leaves a balance due; the note carries its amount. */
    case PaymentRecorded = 6;
    /** A credit note was issued on it; the note carries its number. */
    case CreditNoteIssued = 7;
}
