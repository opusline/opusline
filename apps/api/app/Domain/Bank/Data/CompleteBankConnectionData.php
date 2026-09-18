<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Data;

/** The query string the bank sent the browser back with. */
class CompleteBankConnectionData extends Data
{
    public function __construct(
        #[Max(2048)]
        public string $code,
        #[Regex('/^s[0-9a-f]{32}$/')]
        public string $state,
    ) {}
}
