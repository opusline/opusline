<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Recovery;

use Illuminate\Support\Str;

final class RecoveryCodes
{
    public const int COUNT = 8;

    /**
     * @return list<string>
     */
    public static function mint(): array
    {
        return array_map(
            fn (): string => Str::random(10).'-'.Str::random(10),
            range(1, self::COUNT),
        );
    }
}
