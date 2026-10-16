<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Enums;

/**
 * The statuses an invoice goes through once a plateforme agréée carries it,
 * backed by the codes of the reform's cycle de vie (CDV). Only the statuses
 * Opusline will read or report are listed; the full catalogue lives in the
 * DGFiP's external specifications, which #520 checks before wiring them.
 */
enum LifecycleStatus: int
{
    /** Handed to the platform: the mandatory starting point. */
    case Deposited = 200;
    /** The recipient's platform took it. */
    case Received = 202;
    case Approved = 205;
    case PartiallyApproved = 206;
    case Disputed = 207;
    /** Mandatory: the buyer refuses the invoice. */
    case Refused = 210;
    /** Mandatory: paid, which is what cash-basis VAT reads. */
    case Collected = 212;

    /** The statuses the reform obliges the buyer to report. */
    public function isMandatory(): bool
    {
        return in_array($this, [self::Deposited, self::Refused, self::Collected], true);
    }
}
