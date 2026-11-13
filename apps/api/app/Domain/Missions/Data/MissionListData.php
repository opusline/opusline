<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class MissionListData extends Data
{
    /**
     * @param  list<MissionListItemData>  $missions
     */
    public function __construct(
        #[DataCollectionOf(MissionListItemData::class)]
        public array $missions,
    ) {}
}
