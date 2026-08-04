<?php

declare(strict_types=1);

namespace App\Domain\Missions\Enums;

/**
 * Rounding increment for time entries, expressed as a fraction of the
 * mission's billing unit: half or a quarter of a day/hour, or to the minute.
 */
enum EntryRounding: int
{
    case Half = 0;
    case Quarter = 1;
    case Minute = 2;
}
