<?php

declare(strict_types=1);

namespace App\Domain\Bank\Enums;

enum BankStatementFormat: int
{
    case Csv = 0;
    case Ofx = 1;
    case Qif = 2;
    case Camt053 = 3;

    /** Not a file: the rolling statement a bank connection keeps extending with each sync. */
    case EnableBanking = 4;
}
