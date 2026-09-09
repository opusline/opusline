<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Data;

use Spatie\LaravelData\Data;

/** WebAuthn options as the browser API takes them, base64url-encoded where it expects bytes. */
class PasskeyOptionsData extends Data
{
    /**
     * @param  array<string, mixed>  $options
     */
    public function __construct(
        public array $options,
    ) {}
}
