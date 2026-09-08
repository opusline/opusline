<?php

declare(strict_types=1);

use App\Domain\Passkeys\Models\Passkey;
use App\Domain\Passkeys\Webauthn\PasskeyVerificationFailed;
use App\Domain\Passkeys\Webauthn\RelyingParty;
use App\Domain\Passkeys\Webauthn\VerifiedRegistration;
use App\Domain\Passkeys\Webauthn\WebauthnLibCeremony;
use App\Domain\Users\Models\User;
use Tests\Support\PasskeyAuthenticatorSimulator;

const SIMULATED_ORIGIN = 'http://localhost:3000';

function realCeremony(): WebauthnLibCeremony
{
    return new WebauthnLibCeremony(new RelyingParty(
        id: 'localhost',
        name: 'Opusline',
        origins: ['http://localhost', SIMULATED_ORIGIN],
    ));
}

function simulator(string $origin = SIMULATED_ORIGIN, string $relyingPartyId = 'localhost'): PasskeyAuthenticatorSimulator
{
    return new PasskeyAuthenticatorSimulator($relyingPartyId, $origin);
}

test('a registration round-trips through the real library', function (): void {
    $user = User::factory()->create();
    $ceremony = realCeremony();
    $authenticator = simulator();

    $options = $ceremony->creationOptions($user, 'handle-'.$user->id, []);

    expect($options['rp'])->toEqual(['name' => 'Opusline', 'id' => 'localhost'])
        ->and($options['user']['name'])->toBe($user->email)
        ->and($options['authenticatorSelection']['residentKey'])->toBe('required')
        ->and($options['attestation'])->toBe('none');

    $verified = $ceremony->verifyRegistration($authenticator->register($options), $options);

    expect($verified->credentialId)->toBe($authenticator->encodedCredentialId())
        ->and($verified->counter)->toBe(0)
        ->and($verified->transports)->toBe(['internal'])
        ->and($verified->aaguid)->toBeNull()
        ->and(base64_decode($verified->publicKey, true))->toBeString()->not->toBe('');
});

test('an assertion signed for the issued challenge is accepted', function (): void {
    $user = User::factory()->create(['passkey_user_handle' => 'handle-42']);
    $ceremony = realCeremony();
    $authenticator = simulator();
    $creation = $ceremony->creationOptions($user, 'handle-42', []);
    $verified = $ceremony->verifyRegistration($authenticator->register($creation), $creation);
    $passkey = Passkey::factory()->for($user)->create([
        'credential_id' => $verified->credentialId,
        'public_key' => $verified->publicKey,
        'counter' => 0,
    ]);

    $request = $ceremony->requestOptions([$verified->credentialId], requireUserVerification: true);

    expect($request['rpId'])->toBe('localhost')
        ->and($request['allowCredentials'][0]['id'])->toBe($verified->credentialId)
        ->and($request['userVerification'])->toBe('required');

    $counter = $ceremony->verifyAssertion($authenticator->assert($request, 5, 'handle-42'), $request, $passkey, 'handle-42');

    expect($counter)->toBe(5);
});

test('the library refuses what a forged assertion gets wrong', function (string $flaw): void {
    $user = User::factory()->create(['passkey_user_handle' => 'handle-42']);
    $ceremony = realCeremony();
    $authenticator = simulator();
    $creation = $ceremony->creationOptions($user, 'handle-42', []);
    $verified = $ceremony->verifyRegistration($authenticator->register($creation), $creation);
    $passkey = Passkey::factory()->for($user)->create([
        'credential_id' => $verified->credentialId,
        'public_key' => $verified->publicKey,
        'counter' => 5,
    ]);
    $request = $ceremony->requestOptions([$verified->credentialId], requireUserVerification: true);

    $assertion = match ($flaw) {
        'wrong origin' => $authenticator->claiming('https://evil.example', 'localhost')->assert($request, 6, 'handle-42'),
        'wrong relying party' => $authenticator->claiming(SIMULATED_ORIGIN, 'evil.example')->assert($request, 6, 'handle-42'),
        'stale challenge' => $authenticator->assert(['challenge' => 'AAAA'], 6, 'handle-42'),
        'replayed counter' => $authenticator->assert($request, 5, 'handle-42'),
        'another user handle' => $authenticator->assert($request, 6, 'handle-99'),
        'no user verification' => $authenticator->assert($request, 6, 'handle-42', userVerified: false),
    };

    expect(fn (): int => $ceremony->verifyAssertion($assertion, $request, $passkey, 'handle-42'))
        ->toThrow(PasskeyVerificationFailed::class);
})->with([
    'wrong origin',
    'wrong relying party',
    'stale challenge',
    'replayed counter',
    'another user handle',
    'no user verification',
]);

test('a registration answering another challenge or origin is refused', function (string $flaw): void {
    $user = User::factory()->create();
    $ceremony = realCeremony();
    $creation = $ceremony->creationOptions($user, 'handle-1', []);

    $credential = match ($flaw) {
        'wrong origin' => simulator(origin: 'https://evil.example')->register($creation),
        'stale challenge' => simulator()->register(['challenge' => 'AAAA']),
    };

    expect(fn (): VerifiedRegistration => $ceremony->verifyRegistration($credential, $creation))
        ->toThrow(PasskeyVerificationFailed::class);
})->with(['wrong origin', 'stale challenge']);
