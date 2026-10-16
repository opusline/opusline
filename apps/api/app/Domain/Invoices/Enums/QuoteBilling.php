<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/** Which part of an accepted quote an invoice bills. */
enum QuoteBilling: int
{
    case Deposit = 0;
    case Balance = 1;
    case Full = 2;
}
