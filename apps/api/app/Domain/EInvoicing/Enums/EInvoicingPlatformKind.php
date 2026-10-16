<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Enums;

/** The plateformes agréées Opusline has an adapter for (docs/e-invoicing.md). */
enum EInvoicingPlatformKind: int
{
    case SuperPdp = 0;
}
