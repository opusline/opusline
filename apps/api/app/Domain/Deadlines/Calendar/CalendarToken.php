<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Calendar;

use Illuminate\Support\Str;

/**
 * The credential in an ICS feed URL. Long and alphanumeric, which is what the
 * feed route matches on — see routes/api/deadlines.php.
 */
final readonly class CalendarToken
{
    public const int LENGTH = 64;

    public static function mint(): string
    {
        return Str::random(self::LENGTH);
    }
}
