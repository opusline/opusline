<?php

declare(strict_types=1);

namespace App\Domain\Settings\Enums;

/**
 * What a fiscal deadline is for. Labels live on the frontend, like every other
 * enum here.
 */
enum FiscalDeadlineKind: int
{
    /** TVA return — CA3 under réel normal, CA12 under réel simplifié. */
    case Vat = 0;

    /** URSSAF contributions on the period's collections. */
    case Urssaf = 1;
}
