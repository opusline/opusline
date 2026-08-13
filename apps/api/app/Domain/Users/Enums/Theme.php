<?php

declare(strict_types=1);

namespace App\Domain\Users\Enums;

enum Theme: int
{
    case System = 0;
    case Light = 1;
    case Dark = 2;

    public function preference(): string
    {
        return match ($this) {
            self::System => 'system',
            self::Light => 'light',
            self::Dark => 'dark',
        };
    }
}
