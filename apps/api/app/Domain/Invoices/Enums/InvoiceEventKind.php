<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

enum InvoiceEventKind: int
{
    case Created = 0;
    case Sent = 1;
    case Reminded = 2;
    case Paid = 3;
    case Updated = 4;
}
