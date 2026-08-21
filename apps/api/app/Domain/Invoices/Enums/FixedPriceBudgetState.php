<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/**
 * How much of a forfait its tracked time has eaten, as three states rather than a
 * raw percentage: the threshold that separates them is a product decision, and
 * resolving it here keeps every screen — banner, tile, badge, « À traiter » — reading
 * the same one.
 *
 * Labels live on the frontend, like every other enum here.
 */
enum FixedPriceBudgetState: int
{
    case Ok = 0;
    case Warning = 1;
    case Exceeded = 2;

    /** Where a forfait stops being comfortable: four fifths of it spent. */
    public const int WARNING_THRESHOLD_BP = 8_000;

    /**
     * Whether the forfait is overrun is decided on the money, not on the share: the
     * share is floored to whole basis points, so a forfait a few cents past its price
     * reads as exactly 100 % and would otherwise be filed as merely warned — with a
     * negative « il reste » in the copy to prove it.
     */
    public static function forConsumption(bool $isOverrun, int $consumedShareBp): self
    {
        if ($isOverrun) {
            return self::Exceeded;
        }

        return $consumedShareBp >= self::WARNING_THRESHOLD_BP ? self::Warning : self::Ok;
    }
}
