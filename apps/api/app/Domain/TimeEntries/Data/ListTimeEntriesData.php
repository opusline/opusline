<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Data;

use Spatie\LaravelData\Attributes\Validation\AfterOrEqual;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Data;

class ListTimeEntriesData extends Data
{
    public function __construct(
        #[DateFormat('Y-m-d')]
        public string $from,
        #[DateFormat('Y-m-d'), AfterOrEqual('from')]
        public string $to,
    ) {}
}
