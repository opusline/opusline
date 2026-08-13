<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

enum InvoiceStatus: int
{
    case Draft = 0;
    case Sent = 1;
    case Paid = 2;

    /**
     * Whether the invoice exists outside Opusline. A draft is a note to self;
     * everything else has been handed to a client and is no longer ours to discard.
     */
    public function isIssued(): bool
    {
        return $this !== self::Draft;
    }

    /**
     * You cannot chase a bill the client never received, nor one already settled.
     */
    public function canBeReminded(): bool
    {
        return $this === self::Sent;
    }
}
