<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class CatalogData extends Data
{
    /**
     * @param  list<CatalogItemData>  $items
     */
    public function __construct(
        #[DataCollectionOf(CatalogItemData::class)]
        public array $items,
    ) {}
}
