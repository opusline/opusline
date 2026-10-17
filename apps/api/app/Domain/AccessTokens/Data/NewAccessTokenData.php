<?php

declare(strict_types=1);

namespace App\Domain\AccessTokens\Data;

use Spatie\LaravelData\Data;

/** The one answer that carries the secret: it is stored hashed and never shown again. */
class NewAccessTokenData extends Data
{
    public function __construct(
        public AccessTokenData $token,
        /** The bearer value to give the other application, shown this once. */
        public string $plainTextToken,
    ) {}
}
