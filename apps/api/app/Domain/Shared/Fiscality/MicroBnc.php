<?php

declare(strict_types=1);

namespace App\Domain\Shared\Fiscality;

use App\Domain\Shared\Money\Rate;
use Cknow\Money\Money;

/**
 * The micro-BNC régime's statutory figures — the law's, not the account's, so
 * they live next to their arithmetic rather than in a settings row.
 *
 * @see https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000041467284 CGI art. 102 ter
 */
final readonly class MicroBnc
{
    /** The flat abatement granted instead of real charges, as a share of receipts. */
    public const int ABATEMENT_RATE_BP = 3_400;

    /** The abatement never drops below this, however small the year. */
    public const int ABATEMENT_FLOOR_CENTS = 30_500;

    /**
     * The annual receipts a service provider may collect and stay in the
     * régime. The law revalues it every three years; a year it has not set yet
     * has no ceiling to read, rather than the last one quietly carried forward.
     *
     * @see https://www.autoentrepreneur.urssaf.fr/portail/accueil/sinformer-sur-le-statut/toutes-les-actualites/2026--modification-des-seuils-de.html 83 600 € from 2026
     */
    public static function ceilingCentsFor(int $year): ?int
    {
        return match (true) {
            $year >= 2026 && $year <= 2028 => 8_360_000,
            $year >= 2023 && $year <= 2025 => 7_770_000,
            $year >= 2020 && $year <= 2022 => 7_260_000,
            default => null,
        };
    }

    public static function abatementOf(Money $annualReceiptsHt): Money
    {
        $rated = Rate::of($annualReceiptsHt, self::ABATEMENT_RATE_BP);
        $floor = new Money(self::ABATEMENT_FLOOR_CENTS, $annualReceiptsHt->getCurrency()->getCode());

        return $rated->greaterThan($floor) ? $rated : $floor;
    }
}
