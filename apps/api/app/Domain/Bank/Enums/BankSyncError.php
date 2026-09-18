<?php

declare(strict_types=1);

namespace App\Domain\Bank\Enums;

/**
 * Why a call to the bank through Enable Banking failed. Kept on the
 * connection after a failed sync, so the Compte pro page can say what went
 * wrong with the last nightly run too.
 */
enum BankSyncError: int
{
    /** Enable Banking or the bank did not answer, or answered something unreadable. */
    case Unavailable = 0;

    /** The bank's quota of unattended reads is spent; it resets within hours. */
    case RateLimited = 1;

    /** The consent lapsed or was revoked: only a new authorization at the bank helps. */
    case ConsentExpired = 2;

    /** Enable Banking refused the application id or its key. */
    case CredentialsRejected = 3;

    /** The bank reports the account in another currency than this account's. */
    case CurrencyMismatch = 4;

    public function httpStatus(): int
    {
        return $this === self::Unavailable ? 503 : 409;
    }

    public function messageKey(): string
    {
        return match ($this) {
            self::Unavailable => 'bank.sync_unavailable',
            self::RateLimited => 'bank.sync_rate_limited',
            self::ConsentExpired => 'bank.sync_consent_expired',
            self::CredentialsRejected => 'bank.sync_credentials_rejected',
            self::CurrencyMismatch => 'bank.sync_currency_mismatch',
        };
    }
}
