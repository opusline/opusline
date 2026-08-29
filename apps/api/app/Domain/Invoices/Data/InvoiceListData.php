<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class InvoiceListData extends Data
{
    /**
     * @param  list<InvoiceListItemData>  $invoices
     * @param  list<InvoiceClientTotalsData>  $clientTotals
     */
    public function __construct(
        #[DataCollectionOf(InvoiceListItemData::class)]
        public array $invoices,
        /** Carried by the ledger's first page only — empty on cursor pages and fiche slices. */
        #[DataCollectionOf(InvoiceClientTotalsData::class)]
        public array $clientTotals,
        /** Cursor for the next (older) page of `invoices`; null on the last one. */
        public ?string $nextCursor,
    ) {}
}
