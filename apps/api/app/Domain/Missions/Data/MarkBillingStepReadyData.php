<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Data;

class MarkBillingStepReadyData extends Data
{
    public function __construct(
        #[BooleanType]
        public bool $isReady,
    ) {}
}
