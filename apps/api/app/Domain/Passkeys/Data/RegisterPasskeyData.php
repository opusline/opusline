<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Data;

use App\Domain\Passkeys\Webauthn\CredentialJson;
use Spatie\LaravelData\Attributes\Validation\Json;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

class RegisterPasskeyData extends Data
{
    /**
     * @param  string  $credential  the browser's registration response, JSON-encoded
     */
    public function __construct(
        #[Min(1), Max(100)]
        public string $name,
        #[Json]
        public string $credential,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function decodedCredential(): array
    {
        return CredentialJson::decode($this->credential);
    }
}
