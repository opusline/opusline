<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/** Where the account's invoices and quotes are written: it decides what the Create button does. */
enum InvoicingMode: int
{
    /** Opusline numbers them, renders the PDF and sends them. */
    case Opusline = 0;

    /** Another tool issues them; Opusline only records and tracks them. */
    case Elsewhere = 1;
}
