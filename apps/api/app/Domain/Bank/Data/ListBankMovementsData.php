<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class ListBankMovementsData extends Data
{
    public function __construct(
        /** Opaque, from a previous page's `nextCursor`; omit for the newest page. */
        #[StringType, Max(1024)]
        public ?string $cursor = null,
    ) {}
}
