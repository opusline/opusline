<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class CraListData extends Data
{
    /**
     * @param  list<CraListItemData>  $cras
     */
    public function __construct(
        #[DataCollectionOf(CraListItemData::class)]
        public array $cras,
        public CraCountsData $counts,
    ) {}
}
