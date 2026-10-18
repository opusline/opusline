<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class UninvoicedPeriodListData extends Data
{
    /**
     * @param  list<UninvoicedPeriodData>  $periods
     */
    public function __construct(
        /** Richest first. Not paginated: at most one period per mission. */
        #[DataCollectionOf(UninvoicedPeriodData::class)]
        public array $periods,
    ) {}
}
