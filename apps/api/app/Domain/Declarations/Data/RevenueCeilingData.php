<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use Spatie\LaravelData\Data;

/**
 * The year's collections against the micro-BNC ceiling, up to the end of the
 * shown month — the running total the déclarations of the year add up to.
 *
 * The ceiling is the full-year figure even in the year the business started,
 * where the fisc prorates it by the days remaining: a prorated bar would
 * need the exact start day the account may not carry, so the honest reading
 * is the statutory one, and the first year reads optimistic by design.
 */
class RevenueCeilingData extends Data
{
    public function __construct(
        public int $year,
        public MoneyData $collectedHt,
        public MoneyData $ceiling,
        /** collectedHt as a share of the ceiling, truncated; past 10 000 once the ceiling is crossed. */
        public int $shareBp,
        /** What is left under the ceiling — negative once it is crossed. */
        public SignedMoneyData $margin,
    ) {}
}
