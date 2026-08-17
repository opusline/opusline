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

    // The freelancer's own administrative pack — the pieces a client asks for
    // before signing. These attach to the account, never to a client or mission.
    case Kbis = 6;
    case UrssafVigilance = 7;
    case Insurance = 8;
    case Rib = 9;

    /**
     * The pack a client typically asks for before signing. Anything missing
     * from it is what the "Mes documents" page nags about.
     *
     * @return list<self>
     */
    public static function administrativePack(): array
    {
        return [self::Kbis, self::UrssafVigilance, self::Insurance, self::Rib];
    }

    public function isAdministrative(): bool
    {
        return in_array($this, self::administrativePack(), strict: true);
    }
}
