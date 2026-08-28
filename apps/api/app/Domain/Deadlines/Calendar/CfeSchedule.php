<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Calendar;

use App\Domain\Settings\Models\UserSettings;
use Cknow\Money\Money;
use Money\Money as MoneyPhp;

/**
 * How one year's CFE is paid. Above 3 000 € it comes in two: an acompte of half
 * by 15 June and the rest by 15 December; at or below, once in December.
 *
 * The split lives here rather than in the generator because the pricer needs
 * the same answer — a solde still charged the full amount would announce the
 * year at 150 % of the real bill.
 */
final readonly class CfeSchedule
{
    private const int INSTALMENT_THRESHOLD_CENTS = 300_000;

    /**
     * The year a business is created is exempt. Read by both the calendar and
     * the treasury provision, which would otherwise disagree about the same
     * December bill.
     */
    public static function isExemptYear(UserSettings $settings, int $year): bool
    {
        return $settings->business_started_on?->year === $year;
    }

    public static function isSplit(Money $expected): bool
    {
        return (int) $expected->getAmount() > self::INSTALMENT_THRESHOLD_CENTS;
    }

    public static function instalment(Money $expected): Money
    {
        return $expected->divide(2, MoneyPhp::ROUND_HALF_UP);
    }

    /** What December still owes: the whole bill, less any June acompte. */
    public static function balance(Money $expected): Money
    {
        return self::isSplit($expected)
            ? $expected->subtract(self::instalment($expected))
            : $expected;
    }
}
