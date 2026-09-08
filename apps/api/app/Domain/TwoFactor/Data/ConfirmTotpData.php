<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Data;

use Spatie\LaravelData\Attributes\Validation\Digits;
use Spatie\LaravelData\Data;

class ConfirmTotpData extends Data
{
    public function __construct(
        /** @var non-empty-string */
        #[Digits(6)]
        public string $code,
    ) {}
}
