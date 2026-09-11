<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Data;

use Spatie\LaravelData\Data;

/**
 * How full a civil month is: the days actually worked against the days the
 * calendar offered. Feeds the "Mois en cours" tile of the week view.
 */
class MonthWorkloadData extends Data
{
    public function __construct(
        /** The month these figures cover, as `2026-08`. */
        public string $month,
        /**
         * Weekdays of the month less the public holidays of the account's
         * business country — the French "jours ouvrés".
         */
        public int $businessDays,
        /**
         * Days of the month carrying tracked time, billable or not.
         *
         * A count of days, not a sum of day fractions: a four-hour day and a
         * nine-hour day are both one day behind you, and the tile reads as
         * "how much of the month is done", not "how full were the days".
         */
        public int $workedDays,
    ) {}
}
