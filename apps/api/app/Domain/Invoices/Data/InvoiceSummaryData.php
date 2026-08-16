<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * Everything above the invoice list on the Factures screen.
 */
class InvoiceSummaryData extends Data
{
    /**
     * @param  list<InvoiceForecastData>  $forecast
     * @param  list<InvoiceTodoData>  $todo
     */
    public function __construct(
        public string $month,
        /** Issued and unpaid, gross — what is still owed to you. */
        public InvoiceTotalData $toCollect,
        public InvoiceOverdueData $overdue,
        #[DataCollectionOf(InvoiceForecastData::class)]
        public array $forecast,
        /** Billable time tracked in the month that no invoice covers yet, net. */
        public InvoiceTotalData $monthUnbilled,
        /** All billable time no invoice covers, whenever it was worked — one count per mission. */
        public InvoiceTotalData $unbilled,
        public InvoiceCountsData $counts,
        #[DataCollectionOf(InvoiceTodoData::class)]
        public array $todo,
        /** Total before the list was capped, so the client can say "+N autres". */
        public int $todoTotal,
    ) {}
}
