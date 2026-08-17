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
        /** Invoiced HT over the current civil month. */
        public MoneyData $currentMonth,
        /** Invoiced HT since the mission began — the "CA cumulé" tile. */
        public MoneyData $total,
        /**
         * Total spread over every month from the first invoice to today,
         * including the months that billed nothing. Null until the mission has
         * been invoiced once, so the tile can stay empty rather than read zero.
         */
        public ?MoneyData $monthlyAverage,
    ) {}
}
