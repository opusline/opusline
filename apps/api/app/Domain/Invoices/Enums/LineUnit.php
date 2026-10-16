<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Enums;

/** What one unit of a catalogue item or a document line counts. */
enum LineUnit: int
{
    case Day = 0;
    case Hour = 1;
    case Flat = 2;
    case Unit = 3;
}
