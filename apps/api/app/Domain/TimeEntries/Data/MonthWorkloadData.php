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
         * Time tracked in the month expressed in days, in basis points
         * (10 000 = one day), counting every entry whether billable or not.
         *
         * Each day is capped at one: a ten-hour day on a seven-hour workday
         * reports a full day, not 1,43. The tile reads as "how much of the
         * month is behind you", which overtime cannot push past 100 %.
         */
        public int $workedDayFractionBp,
    ) {}
}
