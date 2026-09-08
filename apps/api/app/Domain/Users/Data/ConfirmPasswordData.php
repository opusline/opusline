<?php

declare(strict_types=1);

namespace App\Domain\Users\Data;

use Spatie\LaravelData\Attributes\Validation\CurrentPassword;
use Spatie\LaravelData\Data;

class ConfirmPasswordData extends Data
{
    public function __construct(
        #[CurrentPassword('web')]
        public string $password,
    ) {}
}
