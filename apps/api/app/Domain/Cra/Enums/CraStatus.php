<?php

declare(strict_types=1);

namespace App\Domain\Cra\Enums;

enum CraStatus: int
{
    case Draft = 0;
    case Sent = 1;
    case Signed = 2;

    /**
     * Whether the CRA has left Opusline. A draft is a working grid; everything else
     * has been handed to a client and must keep reporting the days they received.
     */
    public function isIssued(): bool
    {
        return $this !== self::Draft;
    }
}
