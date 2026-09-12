<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Shared\Calendar\CivilMonth;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class SummarizeDeclarationsData extends Data
{
    public function __construct(
        /** The month to declare (`2026-07`); omitted, the most recently closed one. Never the running month. */
        #[StringType, Regex(CivilMonth::EXPRESSION)]
        public ?string $period = null,
    ) {}
}
