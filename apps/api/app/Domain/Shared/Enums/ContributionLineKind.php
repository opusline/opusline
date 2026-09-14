<?php

declare(strict_types=1);

namespace App\Domain\Shared\Enums;

/**
 * The lines a micro-entrepreneur's URSSAF declaration is settled in, each a
 * rate on the same collected base.
 */
enum ContributionLineKind: int
{
    case SocialContributions = 0;
    case Cfp = 1;
    case LiberatingPayment = 2;
}
