<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class TimeEntryListData extends Data
{
    /**
     * @param  list<TimeEntryData>  $timeEntries
     */
    public function __construct(
        #[DataCollectionOf(TimeEntryData::class)]
        public array $timeEntries,
    ) {}
}
