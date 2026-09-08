<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Domain\Passkeys\Models\Passkey;
use App\Domain\Passkeys\Webauthn\PasskeyCeremony;
use App\Domain\Passkeys\Webauthn\PasskeyVerificationFailed;
use App\Domain\Passkeys\Webauthn\VerifiedRegistration;
use App\Domain\Users\Models\User;
use Illuminate\Support\Str;

/**
 * Stands in for the WebAuthn library so the flows can be exercised without a
 * browser: a credential is "signed" by carrying the challenge it answers.
 */
final class FakePasskeyCeremony implements PasskeyCeremony
{
    public function creationOptions(User $user, string $userHandle, array $excludeCredentialIds): array
    {
        return [
            'challenge' => Str::random(43),
            'rp' => ['name' => 'Opusline', 'id' => 'localhost'],
            'user' => ['id' => $userHandle, 'name' => $user->email, 'displayName' => $user->name],
            'excludeCredentials' => array_map(fn (string $id): array => ['type' => 'public-key', 'id' => $id], $excludeCredentialIds),
        ];
    }

    public function verifyRegistration(array $credential, array $options): VerifiedRegistration
    {
        if (($credential['challenge'] ?? null) !== $options['challenge'] || ! is_string($credential['id'] ?? null)) {
            throw new PasskeyVerificationFailed('Challenge mismatch.');
        }

        return new VerifiedRegistration(
            credentialId: $credential['id'],
            publicKey: base64_encode('fake-public-key'),
            counter: 0,
            transports: ['internal'],
            aaguid: null,
            backupEligible: true,
            backedUp: true,
        );
    }

    public function requestOptions(array $allowCredentialIds, bool $requireUserVerification): array
    {
        return [
            'challenge' => Str::random(43),
            'rpId' => 'localhost',
            'allowCredentials' => array_map(fn (string $id): array => ['type' => 'public-key', 'id' => $id], $allowCredentialIds),
            'userVerification' => $requireUserVerification ? 'required' : 'preferred',
        ];
    }

    public function verifyAssertion(array $credential, array $options, Passkey $passkey, string $expectedUserHandle): int
    {
        if (($credential['challenge'] ?? null) !== $options['challenge']) {
            throw new PasskeyVerificationFailed('Challenge mismatch.');
        }

        if (($credential['userHandle'] ?? $expectedUserHandle) !== $expectedUserHandle) {
            throw new PasskeyVerificationFailed('User handle mismatch.');
        }

        $counter = $credential['counter'] ?? $passkey->counter + 1;

        if (! is_int($counter) || ($passkey->counter !== 0 && $counter <= $passkey->counter)) {
            throw new PasskeyVerificationFailed('Counter did not increase.');
        }

        return $counter;
    }
}
