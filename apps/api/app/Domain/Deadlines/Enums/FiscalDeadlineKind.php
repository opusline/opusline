<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Enums;

/**
 * The recurring French fiscal deadlines the app tracks. Declaration and payment
 * share a case wherever they share a date, which is every case here: URSSAF
 * télépaie on the declaration date, and the CA3 is due and paid the same day.
 */
enum FiscalDeadlineKind: int
{
    case UrssafDeclaration = 0;
    case VatCa3 = 1;
    case VatCa12 = 2;
    case Cfe = 3;
    case CfeInstalment = 4;
}
