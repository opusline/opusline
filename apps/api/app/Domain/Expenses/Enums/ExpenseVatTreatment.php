<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Enums;

/**
 * How the TVA on a purchase reaches the CA3. The receipt decides, never the
 * supplier's country: a foreign SaaS billing through a European entity with
 * 20 % on the invoice is Domestic.
 */
enum ExpenseVatTreatment: int
{
    /** A French invoice carrying TVA at the stated rate. */
    case Domestic = 0;

    /** An EU supplier who invoiced without TVA against the intra-community number (autoliquidation). */
    case ReverseChargeEu = 1;

    /** A non-EU supplier who invoiced without TVA (autoliquidation). */
    case ReverseChargeNonEu = 2;

    /** No TVA at all: insurance, bank fees, stamps, CFE. */
    case Exempt = 3;

    /** Whether the user self-assesses the French TVA — due and deducted on the same CA3, so it nets to nothing. */
    public function isReverseCharge(): bool
    {
        return $this === self::ReverseChargeEu || $this === self::ReverseChargeNonEu;
    }
}
