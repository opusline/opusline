<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/** Which sheet a PaperDocument prints as. */
enum DocumentKind
{
    case Invoice;
    case Quote;
    case CreditNote;
}
