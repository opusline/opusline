<?php

declare(strict_types=1);

namespace App\Domain\Bank\Enums;

enum BankMatchStatus: int
{
    case Pending = 0;
    case Validated = 1;

    /**
     * Dismissed rows are kept, not deleted: the unique movement key then blocks
     * the same suggestion from reappearing on the next overlapping import.
     */
    case Dismissed = 2;
}
