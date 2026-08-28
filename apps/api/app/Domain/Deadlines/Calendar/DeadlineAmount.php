<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Calendar;

use Cknow\Money\Money;

/**
 * What one occurrence is expected to cost, and how much that figure can be
 * trusted. Null means nothing can be said yet — a period that has not started
 * has collected nothing, and a CFE nobody has entered has no amount at all.
 */
final readonly class DeadlineAmount
{
    public function __construct(
        public ?Money $amount,
        /** The contribution rate the estimate applied; null when no single rate produced it. */
        public ?int $rateBp,
        /** Derived from the account's collections rather than told to us by the user. */
        public bool $isEstimate,
        /**
         * The HT the amount was computed from — the URSSAF declaration's base —
         * or null for the figures that have none.
         *
         * Carried rather than left to the reader to divide back out of the
         * amount: contributions = base × rate rounds half up to the cent, so
         * the division is not invertible and reconstructing it drifts.
         */
        public ?Money $base = null,
    ) {}
}
