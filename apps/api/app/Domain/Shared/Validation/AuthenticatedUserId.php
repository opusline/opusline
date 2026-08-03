<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use Spatie\LaravelData\Support\Validation\References\ExternalReference;

class AuthenticatedUserId implements ExternalReference
{
    public function getValue(): int|string|null
    {
        return auth()->id();
    }
}
