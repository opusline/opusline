<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Enums;

/** Which side of the platform the credentials open: the sandbox files nothing with the administration. */
enum PlatformEnvironment: int
{
    case Sandbox = 0;
    case Production = 1;

    public static function fromApiValue(?string $value): ?self
    {
        return match ($value) {
            'sandbox' => self::Sandbox,
            'production' => self::Production,
            default => null,
        };
    }
}
