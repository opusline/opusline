<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Data;

use Spatie\LaravelData\Data;

class RecoveryCodesData extends Data
{
    /**
     * @param  list<string>  $codes
     */
    public function __construct(
        public array $codes,
    ) {}
}
