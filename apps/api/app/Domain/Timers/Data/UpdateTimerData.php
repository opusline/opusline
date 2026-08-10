<?php

declare(strict_types=1);

namespace App\Domain\Timers\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Present;
use Spatie\LaravelData\Data;

class UpdateTimerData extends Data
{
    public function __construct(
        #[Present, Max(2000)]
        public ?string $note,
    ) {}
}
