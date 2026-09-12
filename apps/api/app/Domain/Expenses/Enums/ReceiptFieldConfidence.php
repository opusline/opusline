<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Enums;

/**
 * How much a field read off a receipt deserves a second look. High means the
 * value stood next to its own label (« Total TTC », « Date de facture »);
 * Low means it was the best of several candidates.
 */
enum ReceiptFieldConfidence: int
{
    case Low = 0;
    case Medium = 1;
    case High = 2;
}
