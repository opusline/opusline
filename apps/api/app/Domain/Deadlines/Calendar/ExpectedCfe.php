<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Calendar;

use Cknow\Money\Money;

/**
 * What the year's CFE is expected to cost, and where the figure came from: the
 * user's own entry, or last year's payment read back from the imported bank
 * movements. Estimated is honest enough to plan on — the commune moves the
 * bill by percent, not by multiples — but it is flagged as such everywhere.
 */
final readonly class ExpectedCfe
{
    public function __construct(
        public Money $amount,
        public bool $isEstimate,
    ) {}
}
