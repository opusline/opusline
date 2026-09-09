<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Actions;

use App\Domain\Passkeys\Models\Passkey;
use App\Domain\Passkeys\Webauthn\CredentialJson;
use App\Domain\Users\Models\User;

class AuthenticatePasskey
{
    public function __construct(private readonly VerifyPasskeyAssertion $verifyPasskeyAssertion) {}

    /**
     * The account a discoverable-credential assertion signs in, or null.
     *
     * @param  array<string, mixed>  $credential
     * @param  array<string, mixed>  $options
     */
    public function handle(array $credential, array $options): ?User
    {
        $credentialId = CredentialJson::id($credential);

        if ($credentialId === null) {
            return null;
        }

        $candidates = Passkey::query()->with('user')->where('credential_id', $credentialId)->get();

        return $this->verifyPasskeyAssertion->handle($credential, $options, $candidates)?->user;
    }
}
