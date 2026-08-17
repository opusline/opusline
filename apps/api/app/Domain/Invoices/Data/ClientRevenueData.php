<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One client's invoiced revenue, for the client listing rows and the client
 * detail header tiles.
 */
class ClientRevenueData extends Data
{
    /**
     * @param  list<MissionRevenueData>  $missions
     */
    public function __construct(
        public int $clientId,
        /** Invoiced HT over the current civil year. */
        public MoneyData $yearToDate,
        /**
         * Issued but unsettled TTC, all years — what the client still owes,
         * VAT included, on the same base as the invoices dashboard.
         */
        public MoneyData $pending,
        /**
         * Mean days between issue and payment over every settled invoice, all
         * years. Null until the client has paid at least one, so the UI can say
         * "no history yet" instead of implying an instant payer.
         */
        public ?int $averagePaymentDelayDays,
        #[DataCollectionOf(MissionRevenueData::class)]
        public array $missions,
    ) {}
}
