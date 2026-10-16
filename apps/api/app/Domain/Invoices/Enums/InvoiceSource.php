<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/** Who wrote the document: another tool, recorded here; or Opusline, from its lines. */
enum InvoiceSource: int
{
    case External = 0;
    case Opusline = 1;
}
