<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Enums;

/** Who read the receipt, so the form can say how far to trust it. */
enum ReceiptReader: int
{
    /** Patterns over the PDF's text layer, on the instance. */
    case Heuristics = 0;

    /** A Claude model, on the account's own Anthropic key. */
    case Claude = 1;
}
