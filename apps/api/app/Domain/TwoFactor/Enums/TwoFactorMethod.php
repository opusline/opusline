<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Enums;

enum TwoFactorMethod: int
{
    case Totp = 0;
}
