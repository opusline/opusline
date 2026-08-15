<?php

declare(strict_types=1);

namespace App\Domain\Users\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Data;

class UpdateReleaseNotesSeenData extends Data
{
    public function __construct(
        #[Max(32), Regex('/^\d+\.\d+\.\d+$/')]
        public string $version,
    ) {}
}
