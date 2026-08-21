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

    /* The pieces a client asks for before signing, filed on the user. */
    case Kbis = 6;
    case Certificate = 7;
    case Insurance = 8;
    case BankDetails = 9;
    case TermsOfSale = 10;
}
