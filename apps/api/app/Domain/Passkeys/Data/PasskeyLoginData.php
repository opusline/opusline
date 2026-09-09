<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Data;

use App\Domain\Passkeys\Webauthn\CredentialJson;
use Spatie\LaravelData\Attributes\Validation\Json;
use Spatie\LaravelData\Data;

class PasskeyLoginData extends Data
{
    /**
     * @param  string  $credential  the browser's assertion response, JSON-encoded
     */
    public function __construct(
        #[Json]
        public string $credential,
        public bool $remember = false,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function decodedCredential(): array
    {
        return CredentialJson::decode($this->credential);
    }
}
