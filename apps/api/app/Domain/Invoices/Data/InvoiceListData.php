<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class InvoiceListData extends Data
{
    /**
     * @param  list<InvoiceListItemData>  $invoices
     */
    public function __construct(
        #[DataCollectionOf(InvoiceListItemData::class)]
        public array $invoices,
    ) {}
}
