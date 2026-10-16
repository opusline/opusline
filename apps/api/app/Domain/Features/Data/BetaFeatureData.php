<?php

declare(strict_types=1);

namespace App\Domain\Features\Data;

use App\Domain\Features\Enums\FeatureFlag;
use Spatie\LaravelData\Data;

class BetaFeatureData extends Data
{
    public function __construct(
        public FeatureFlag $feature,
        /** The URL segment that switches it: PUT /user/features/{key}. */
        public string $key,
        public bool $active,
    ) {}
}
