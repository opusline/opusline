<?php

declare(strict_types=1);

namespace App\Domain\Shared\Fiscality;

/**
 * The revenu fiscal de référence a household may not exceed for the versement
 * libératoire to apply in a given year: the upper bound of the barème's second
 * bracket, per part of quotient familial, read against the RFR of two years
 * before. The law's figure, not the account's, so it lives beside its
 * arithmetic — and a year the finance law has not set yet has no limit at all.
 *
 * @see https://www.impots.gouv.fr/professionnel/questions/en-tant-que-micro-entrepreneur-sous-quelles-conditions-puis-je-opter-pour-l
 */
final readonly class LiberatingPaymentThreshold
{
    /** Keyed by the year the option applies in: 2027 reads the RFR of 2025. */
    private const array CENTS_PER_PART_BY_OPTION_YEAR = [
        2026 => 2_931_500,
        2027 => 2_957_900,
    ];

    public const int QUARTER_PARTS_PER_PART = 4;

    /** The RFR measured in $incomeYear decides the option two years later. */
    public static function optionYearFor(int $incomeYear): int
    {
        return $incomeYear + 2;
    }

    /**
     * Raised by half for each half part and by a quarter for each quarter
     * part, which is the per-part figure times the parts.
     */
    public static function centsFor(int $optionYear, int $quarterParts): ?int
    {
        $perPart = self::CENTS_PER_PART_BY_OPTION_YEAR[$optionYear] ?? null;

        return $perPart === null ? null : intdiv($perPart * $quarterParts, self::QUARTER_PARTS_PER_PART);
    }
}
