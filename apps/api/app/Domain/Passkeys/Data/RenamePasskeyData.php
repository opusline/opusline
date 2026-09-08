<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

class RenamePasskeyData extends Data
{
    public function __construct(
        #[Min(1), Max(100)]
        public string $name,
    ) {}
}
