<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use App\Domain\Shared\Calendar\CivilMonth;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class ListCrasData extends Data
{
    public function __construct(
        /** Narrow the list to one month; every owed month is listed otherwise. */
        #[StringType, Regex(CivilMonth::EXPRESSION)]
        public ?string $month = null,
    ) {}
}
