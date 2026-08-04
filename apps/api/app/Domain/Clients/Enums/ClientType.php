<?php

declare(strict_types=1);

namespace App\Domain\Clients\Enums;

enum ClientType: int
{
    case Direct = 0;
    case Intermediary = 1;
    case Internal = 2;

    public function requiresCraByDefault(): bool
    {
        return $this === self::Intermediary;
    }
}
