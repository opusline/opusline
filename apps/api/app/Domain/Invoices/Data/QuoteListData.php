<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class QuoteListData extends Data
{
    /**
     * @param  list<QuoteListItemData>  $quotes
     */
    public function __construct(
        #[DataCollectionOf(QuoteListItemData::class)]
        public array $quotes,
    ) {}
}
