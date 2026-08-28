<?php

declare(strict_types=1);

namespace App\Domain\Shared\Money;

use Cknow\Money\Money;
use Money\Money as MoneyPhp;

/**
 * Basis points applied to money, in one place and with one rounding mode.
 *
 * TVA on an HT amount, URSSAF contributions on a collected base, the CFE barème
 * on a statutory base: all three round the same way here, because half a cent
 * decides whether a declaration matches the one the URSSAF site computes.
 */
final readonly class Rate
{
    /** A rate of 100 % — every rate in the app is stored as an int share of this. */
    public const int BASIS_POINTS = 10_000;

    /** What $amount owes at $rateBp, rounded half up to the cent. */
    public static function of(Money $amount, int $rateBp): Money
    {
        return $amount
            ->multiply($rateBp)
            ->divide(self::BASIS_POINTS, MoneyPhp::ROUND_HALF_UP);
    }

    /**
     * $part as a share of $whole in basis points, truncated.
     *
     * A share is a proportion for a bar or a caption, never money, so it
     * truncates where of() rounds.
     */
    public static function shareBp(int $part, int $whole): int
    {
        return $whole === 0 ? 0 : intdiv($part * self::BASIS_POINTS, $whole);
    }
}
