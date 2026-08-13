<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Data;

class ListCrasData extends Data
{
    public function __construct(
        /** Narrow the list to one month; every owed month is listed otherwise. */
        #[DateFormat('Y-m')]
        public ?string $month = null,
    ) {}
}
