<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

enum CreditNoteStatus: int
{
    /** Issued, with money still to go back to the client. */
    case Issued = 0;
    /** Nothing left to do: the invoice owes less, or the client has been paid back. */
    case Settled = 1;
}
