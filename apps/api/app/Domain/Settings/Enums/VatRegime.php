<?php

declare(strict_types=1);

namespace App\Domain\Settings\Enums;

enum VatRegime: int
{
    case FranchiseEnBase = 0;
    case ReelSimplifie = 1;
    case ReelNormal = 2;

    public function isLiable(): bool
    {
        return $this !== self::FranchiseEnBase;
    }
}
