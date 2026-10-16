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
    /** The sender's platform passed it on. */
    case Issued = 201;
    /** The recipient's platform took it. */
    case Received = 202;
    /** The buyer acknowledged it. */
    case TakenInCharge = 204;
    case Approved = 205;
    case PartiallyApproved = 206;
    case Disputed = 207;
    /** Mandatory: the buyer refuses the invoice. */
    case Refused = 210;
    /** The buyer sent the payment. */
    case PaymentSent = 211;
    /** Mandatory: paid, which is what cash-basis VAT reads. */
    case Collected = 212;
    /** The platform itself rejected the file: it never reached the buyer. */
    case Rejected = 213;

    /** The statuses the reform obliges the buyer to report. */
    public function isMandatory(): bool
    {
        return in_array($this, [self::Deposited, self::Refused, self::Collected], true);
    }

    /** The code as the platforms spell it in their events, « fr:210 ». */
    public function code(): string
    {
        return 'fr:'.$this->value;
    }

    public static function fromCode(?string $code): ?self
    {
        if (! is_string($code) || ! str_starts_with($code, 'fr:')) {
            return null;
        }

        return self::tryFrom((int) substr($code, 3));
    }
}
