<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Actions;

use App\Domain\Passkeys\Webauthn\PasskeyCeremony;

class StartPasskeyLogin
{
    public function __construct(private readonly PasskeyCeremony $ceremony) {}

    /**
     * Options for a passwordless sign-in: no account is known yet, so the
     * browser picks a discoverable credential, and user verification is
     * required because the passkey is the whole proof.
     *
     * @return array<string, mixed>
     */
    public function handle(): array
    {
        return $this->ceremony->requestOptions([], requireUserVerification: true);
    }
}
