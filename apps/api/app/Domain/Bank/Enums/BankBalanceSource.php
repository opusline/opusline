<?php

declare(strict_types=1);

namespace App\Domain\Bank\Enums;

enum BankBalanceSource: int
{
    case Manual = 0;
    case Statement = 1;

    /**
     * No anchor exists: the balance is the sum of every imported movement,
     * as if the account had opened empty just before the first one. Exact
     * once the full history is imported; the hand-typed anchor corrects it
     * otherwise.
     */
    case Derived = 2;
}
