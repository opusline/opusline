<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Enums;

/** Why a call to the plateforme agréée did not deliver; the user reads the reason's translation. */
enum EInvoicingError: int
{
    /** The platform did not answer, or answered something unreadable. */
    case Unavailable = 0;

    /** The platform refused the client id or its secret. */
    case CredentialsRejected = 1;

    /** The platform has not finished verifying the company: business routes answer 403 until it has. */
    case CompanyUnverified = 2;

    /** No platform credentials are saved for the account. */
    case NotConnected = 3;

    /** The platform refused the document it was handed. */
    case Rejected = 4;

    /** The platform knows no invoice under that id. */
    case NotFound = 5;

    public function httpStatus(): int
    {
        return match ($this) {
            self::Unavailable => 503,
            self::NotFound => 404,
            default => 409,
        };
    }

    public function messageKey(): string
    {
        return match ($this) {
            self::Unavailable => 'einvoicing.unavailable',
            self::CredentialsRejected => 'einvoicing.credentials_rejected',
            self::CompanyUnverified => 'einvoicing.company_unverified',
            self::NotConnected => 'einvoicing.not_connected',
            self::Rejected => 'einvoicing.rejected',
            self::NotFound => 'einvoicing.not_found',
        };
    }
}
