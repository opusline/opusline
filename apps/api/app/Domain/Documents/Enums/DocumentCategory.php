<?php

declare(strict_types=1);

namespace App\Domain\Documents\Enums;

enum DocumentCategory: int
{
    case Contract = 0;
    case Quote = 1;
    case SignedCra = 2;
    case ReceivedInvoice = 3;
    case Other = 4;
    /** The CRA Opusline generated, filed next to the signed return it comes back as. */
    case Cra = 5;
}
