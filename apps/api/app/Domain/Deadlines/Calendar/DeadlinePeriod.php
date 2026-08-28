<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Calendar;

/**
 * The shape of the span an occurrence covers, and so of its period key.
 *
 * Carried on the occurrence rather than read back out of the key with a regex:
 * the generator is the one that knows, and a key format it changed would
 * otherwise be silently mis-parsed into the wrong label. Not backed — it never
 * crosses the wire.
 */
enum DeadlinePeriod
{
    case Month;
    case Quarter;
    case Year;
}
