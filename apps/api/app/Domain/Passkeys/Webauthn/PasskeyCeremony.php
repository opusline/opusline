<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Webauthn;

use App\Domain\Passkeys\Models\Passkey;
use App\Domain\Users\Models\User;

/**
 * The cryptographic half of WebAuthn, as plain arrays: options go to the
 * browser as JSON and its answer comes back the same way. The one place that
 * speaks the library's types is the implementation.
 */
interface PasskeyCeremony
{
    /**
     * @param  list<string>  $excludeCredentialIds  base64url ids already registered
     * @return array<string, mixed>
     */
    public function creationOptions(User $user, string $userHandle, array $excludeCredentialIds): array;

    /**
     * @param  array<string, mixed>  $credential  the browser's registration response
     * @param  array<string, mixed>  $options  the creation options that were issued
     *
     * @throws PasskeyVerificationFailed
     */
    public function verifyRegistration(array $credential, array $options): VerifiedRegistration;

    /**
     * @param  list<string>  $allowCredentialIds  base64url ids; empty for a discoverable login
     * @return array<string, mixed>
     */
    public function requestOptions(array $allowCredentialIds, bool $requireUserVerification): array;

    /**
     * The authenticator's new signature counter.
     *
     * @param  array<string, mixed>  $credential  the browser's assertion response
     * @param  array<string, mixed>  $options  the request options that were issued
     *
     * @throws PasskeyVerificationFailed
     */
    public function verifyAssertion(array $credential, array $options, Passkey $passkey, string $expectedUserHandle): int;
}
