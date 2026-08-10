<?php

declare(strict_types=1);

namespace App\Domain\Timers\Data;

use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Data;

class TrimTimerData extends Data
{
    public function __construct(
        #[IntegerType, Between(1, 86_400)]
        public int $seconds,
    ) {}
}
