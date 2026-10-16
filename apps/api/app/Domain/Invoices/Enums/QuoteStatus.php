<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/**
 * Where a quote stands. « Expiré » is not a status: a sent quote past its
 * validity is expired, and a column would need a cron to say so.
 */
enum QuoteStatus: int
{
    case Draft = 0;
    case Sent = 1;
    case Accepted = 2;
    case Refused = 3;

    /** Numbered and handed to the client: no longer ours to change or discard. */
    public function isIssued(): bool
    {
        return $this !== self::Draft;
    }
}
