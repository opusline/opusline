<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Enums;

/** Why the versement libératoire stops applying. */
enum LiberatingPaymentEndReason: int
{
    /** The household's revenu fiscal de référence exceeds the limit for its parts. */
    case ReferenceTaxIncome = 0;
    /** The receipts crossed the micro-BNC ceiling two calendar years running, which ends the régime itself. */
    case RevenueCeiling = 1;
}
