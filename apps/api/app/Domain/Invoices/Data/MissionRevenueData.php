<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * One mission's invoiced revenue, for the mission rows of the client listing
 * and client detail, and the stat tiles of the mission detail header.
 */
class MissionRevenueData extends Data
{
    public function __construct(
        public int $missionId,
        /** Invoiced HT over the current civil year. */
        public MoneyData $yearToDate,
        /**
         * What the month has earned HT: the time tracked in it at the mission's
         * rate, so the figure moves before anything is invoiced. A mission that
         * prices no time reports what it invoiced this month instead.
         */
        public MoneyData $currentMonth,
        /** Invoiced HT since the mission began — the "CA cumulé" tile. */
        public MoneyData $total,
        /**
         * Total spread over every month from the first invoice to today,
         * including the months that billed nothing. Null until the mission has
         * been invoiced once, so the tile can stay empty rather than read zero.
         */
        public ?MoneyData $monthlyAverage,
        /**
         * Time tracked this civil month, valued in the unit the mission bills
         * in and rounded to its increment — the quantity an invoice for the
         * month would carry, not the raw duration.
         *
         * Exactly one of the two is set, the way TimeEntryData reports a single
         * entry: days on a day-billed mission, minutes on an hourly one. Zero
         * rather than null when the month is simply empty, so the cell can say
         * "nothing yet" instead of "unknown".
         */
        public ?float $currentMonthDays,
        public ?int $currentMonthMinutes,
    ) {}
}
