<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Data;

use App\Domain\Passkeys\Webauthn\CredentialJson;
use Spatie\LaravelData\Attributes\Validation\Digits;
use Spatie\LaravelData\Attributes\Validation\Json;
use Spatie\LaravelData\Attributes\Validation\Prohibits;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\RequiredWithoutAll;
use Spatie\LaravelData\Data;

class TwoFactorChallengeAnswerData extends Data
{
    public function __construct(
        /** @var non-empty-string|null */
        #[RequiredWithoutAll('recoveryCode', 'passkey'), Prohibits('recoveryCode', 'passkey'), Digits(6)]
        public ?string $code,
        #[RequiredWithoutAll('code', 'passkey'), Prohibits('code', 'passkey'), Regex('/^[A-Za-z0-9]{10}-[A-Za-z0-9]{10}$/')]
        public ?string $recoveryCode,
        /** The browser's assertion response, JSON-encoded. */
        #[RequiredWithoutAll('code', 'recoveryCode'), Prohibits('code', 'recoveryCode'), Json]
        public ?string $passkey,
        public bool $trustDevice = false,
    ) {}

    /**
     * @return array<string, mixed>|null
     */
    public function decodedPasskey(): ?array
    {
        return $this->passkey === null ? null : CredentialJson::decode($this->passkey);
    }
}
