<?php

declare(strict_types=1);

namespace App\Domain\Bank\Enums;

/**
 * Why a credit movement was paired with an invoice. Ascending value = descending
 * confidence; the matcher offers the lowest value that applies.
 */
enum BankMatchReason: int
{
    case RefInLabel = 0;
    case ClientInLabel = 1;
    case OverdueUniqueAmount = 2;
}
