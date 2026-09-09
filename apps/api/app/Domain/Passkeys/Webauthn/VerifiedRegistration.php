<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Webauthn;

/** What a successful registration ceremony leaves to store. */
final readonly class VerifiedRegistration
{
    /**
     * @param  string  $credentialId  base64url
     * @param  string  $publicKey  COSE key, base64
     * @param  list<string>  $transports
     */
    public function __construct(
        public string $credentialId,
        public string $publicKey,
        public int $counter,
        public array $transports,
        public ?string $aaguid,
        public bool $backupEligible,
        public bool $backedUp,
    ) {}
}
