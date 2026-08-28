<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Calendar;

use Cknow\Money\Money;

/**
 * A rough CFE from the statutory barème, for an account with nothing better to
 * go on — no entered amount and no past payment on the imported statements.
 *
 * Most independents without premises pay the cotisation minimum: a base the
 * commune picks inside the bracket art. 1647 D CGI opens for their revenue,
 * times the commune's rate. Both halves vary by commune, so this takes the
 * middle of the statutory bracket and a national ballpark rate — explicitly a
 * rough idea, flagged as an estimate everywhere it shows, and beaten by either
 * real source the moment one exists.
 */
final readonly class CfeBareme
{
    /**
     * Below this revenue the cotisation minimum is waived outright
     * (art. 1647 D CGI) — no figure is more honest than a small one.
     */
    private const int EXEMPTION_FLOOR_CENTS = 500_000;

    /**
     * The upper bound of the base the commune may pick, by revenue bracket —
     * the 2025 barème of art. 1647 D CGI, in cents. The lower bound is common
     * to every bracket.
     */
    private const int BASE_FLOOR_CENTS = 24_300;

    /** @var list<array{0: int, 1: int}> [revenue ceiling, base ceiling] */
    private const array BASE_CEILING_CENTS_BY_REVENUE = [
        [1_000_000, 57_900],
        [3_260_000, 115_800],
        [10_000_000, 243_300],
        [25_000_000, 405_600],
        [50_000_000, 579_300],
        [PHP_INT_MAX, 753_300],
    ];

    /**
     * A national ballpark for the taux global communal. Communes range roughly
     * from 15 % to 40 %; the midpoint of a bracket at this rate lands in the
     * few-hundred-euros region most micro-entrepreneurs actually pay.
     */
    private const int RATE_BP = 2_700;

    /** Rounded so the figure reads as the ballpark it is, not as a computation. */
    private const int ROUNDING_CENTS = 1_000;

    public static function estimate(int $revenueCents, string $currency): ?Money
    {
        if ($revenueCents < self::EXEMPTION_FLOOR_CENTS) {
            return null;
        }

        $baseCeiling = self::BASE_CEILING_CENTS_BY_REVENUE[0][1];

        foreach (self::BASE_CEILING_CENTS_BY_REVENUE as [$revenueCeiling, $ceiling]) {
            $baseCeiling = $ceiling;

            if ($revenueCents <= $revenueCeiling) {
                break;
            }
        }

        $base = intdiv(self::BASE_FLOOR_CENTS + $baseCeiling, 2);
        $cfe = intdiv($base * self::RATE_BP, 10_000);

        return new Money(
            intdiv($cfe + intdiv(self::ROUNDING_CENTS, 2), self::ROUNDING_CENTS) * self::ROUNDING_CENTS,
            $currency,
        );
    }
}
