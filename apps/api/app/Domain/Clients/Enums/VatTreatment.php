<?php

declare(strict_types=1);

namespace App\Domain\Clients\Enums;

/**
 * Which VAT rule an invoice to this client falls under.
 *
 * Declared per client rather than inferred from the billing address: that
 * address is free text, and guessing a tax jurisdiction out of "Canada",
 * "canada" or "CA" would put a wrong legal mention on a real invoice. The
 * freelancer states the treatment once; Opusline applies it every time.
 *
 * Labels and the legal mentions they carry live on the frontend, like every
 * other enum here.
 */
enum VatTreatment: int
{
    /** The account's own VAT applies — the domestic case, and the default. */
    case Standard = 0;

    /** EU B2B holding a VAT number: the client accounts for the VAT, not you. */
    case EuReverseCharge = 1;

    /** Outside the EU: the service falls outside the scope of French VAT. */
    case OutsideEu = 2;

    /**
     * Whether the treatment zeroes the rate on its own, whatever the account
     * charges domestically.
     */
    public function exemptsVat(): bool
    {
        return $this !== self::Standard;
    }
}
