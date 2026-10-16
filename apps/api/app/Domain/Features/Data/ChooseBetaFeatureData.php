<?php

declare(strict_types=1);

namespace App\Domain\Features\Data;

use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class ChooseBetaFeatureData extends Data
{
    public function __construct(
        #[Required, BooleanType]
        public bool $active,
    ) {}
}
