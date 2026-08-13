<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * Everything above the invoice list on the Factures screen.
 *
 * The three totals are the page's own subtitle, in order: what is invoiced, what is
 * still to invoice, and what has been collected.
 */
class InvoiceSummaryData extends Data
{
    /**
     * @param  list<InvoiceForecastData>  $forecast
     * @param  list<InvoiceTodoData>  $todo
     */
    public function __construct(
        public string $month,
        /** Invoiced in the month, net of TVA — this is the figure that gets declared. */
        public InvoiceTotalData $invoiced,
        /** Billable tracked time that appears on no invoice yet, at mission rates. */
        public InvoiceTotalData $toInvoice,
        /** Collected in the month, gross, by payment date — the cash-basis figure. */
        public InvoiceTotalData $collected,
        #[DataCollectionOf(InvoiceForecastData::class)]
        public array $forecast,
        public InvoiceCountsData $counts,
        #[DataCollectionOf(InvoiceTodoData::class)]
        public array $todo,
        /** Total before the list was capped, so the client can say "+N autres". */
        public int $todoTotal,
    ) {}
}
