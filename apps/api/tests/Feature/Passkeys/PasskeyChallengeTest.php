<?php

declare(strict_types=1);

use App\Domain\TwoFactor\Enums\TwoFactorMethod;
use App\Domain\Users\Models\User;
use App\Http\Passkeys\Support\PasskeyChallenge;
use App\Http\TwoFactor\Support\TrustedDeviceCookie;

beforeEach(function (): void {
    freezeTodayAtUtcNoon();
    fakePasskeyCeremony();
});

test('a passkey alone turns the challenge on and is offered as its method', function (): void {
    $user = User::factory()->create();
    registerPasskey($user);

    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])
        ->assertAccepted()
        ->assertJsonPath('methods', [TwoFactorMethod::Passkey->value]);

    $this->assertGuest('web');
});

test('an account with both methods lists both', function (): void {
    $user = User::factory()->create();
    enableTotp($user);
    registerPasskey($user);

    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])
        ->assertJsonPath('methods', [TwoFactorMethod::Totp->value, TwoFactorMethod::Passkey->value]);
});

test('the challenge options offer only the pending account\'s passkeys', function (): void {
    $user = User::factory()->create();
    $own = registerPasskey($user);
    registerPasskey(User::factory()->create());

    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertAccepted();

    fromSpa()->postJson('/api/two-factor-challenge/passkey-options')
        ->assertOk()
        ->assertJsonPath('options.allowCredentials.0.id', $own->credential_id)
        ->assertJsonCount(1, 'options.allowCredentials')
        ->assertJsonPath('options.userVerification', 'preferred');
});

test('the challenge options need a pending login', function (): void {
    fromSpa()->postJson('/api/two-factor-challenge/passkey-options')
        ->assertConflict()
        ->assertJsonPath('message', __('two-factor.challenge_expired'));
});

test('a passkey answers the challenge and can trust the browser', function (): void {
    $user = User::factory()->create();
    $passkey = registerPasskey($user);
    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertAccepted();
    $options = fromSpa()->postJson('/api/two-factor-challenge/passkey-options');

    $response = fromSpa()->postJson('/api/two-factor-challenge', [
        'passkey' => fakeCredentialFor($options, $passkey->credential_id),
        'trustDevice' => true,
    ])->assertOk()->assertJsonPath('email', $user->email);

    $this->assertAuthenticatedAs($user, 'web');
    expect(trustedDeviceTokenFrom($response))->toHaveLength(64)
        ->and($passkey->refresh()->last_used_at)->not->toBeNull();
});

test('any of the account\'s passkeys answers the challenge', function (): void {
    $user = User::factory()->create();
    registerPasskey($user);
    $second = registerPasskey($user);
    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertAccepted();
    $options = fromSpa()->postJson('/api/two-factor-challenge/passkey-options');

    fromSpa()->postJson('/api/two-factor-challenge', [
        'passkey' => fakeCredentialFor($options, $second->credential_id),
    ])->assertOk();

    $this->assertAuthenticatedAs($user, 'web');
});

test('another account\'s passkey cannot answer the challenge', function (): void {
    $user = User::factory()->create();
    registerPasskey($user);
    $foreign = registerPasskey(User::factory()->create());
    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertAccepted();
    $options = fromSpa()->postJson('/api/two-factor-challenge/passkey-options');

    fromSpa()->postJson('/api/two-factor-challenge', [
        'passkey' => fakeCredentialFor($options, $foreign->credential_id),
    ])->assertUnprocessable()->assertJsonValidationErrors('passkey');

    $this->assertGuest('web');
});

test('a passkey answer without issued options is refused', function (): void {
    $user = User::factory()->create();
    $passkey = registerPasskey($user);
    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertAccepted();

    fromSpa()->postJson('/api/two-factor-challenge', [
        'passkey' => json_encode(['id' => $passkey->credential_id, 'challenge' => 'anything']),
    ])->assertUnprocessable()->assertJsonValidationErrors('passkey');
});

test('a trusted browser still skips the challenge for a passkey-only account', function (): void {
    $user = User::factory()->create();
    $passkey = registerPasskey($user);
    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertAccepted();
    $options = fromSpa()->postJson('/api/two-factor-challenge/passkey-options');
    $token = trustedDeviceTokenFrom(fromSpa()->postJson('/api/two-factor-challenge', [
        'passkey' => fakeCredentialFor($options, $passkey->credential_id),
        'trustDevice' => true,
    ]));
    fromSpa()->postJson('/api/logout');

    fromSpa()->withCookie(TrustedDeviceCookie::NAME, $token)
        ->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])
        ->assertOk();
});

test('an answer carrying two methods is refused', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    registerPasskey($user);
    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertAccepted();

    fromSpa()->postJson('/api/two-factor-challenge', [
        'code' => totpCodeFor($secret),
        'recoveryCode' => 'aaaaaaaaaa-bbbbbbbbbb',
    ])->assertUnprocessable()->assertJsonValidationErrors(['code', 'recoveryCode']);

    $this->assertGuest('web');
});

test('a passkey challenge left unanswered dies with the pending login', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    registerPasskey($user);
    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertAccepted();
    fromSpa()->postJson('/api/two-factor-challenge/passkey-options')->assertOk();

    fromSpa()->postJson('/api/two-factor-challenge', ['code' => totpCodeFor($secret)])->assertOk();

    expect(session()->has(PasskeyChallenge::SECOND_FACTOR))->toBeFalse();
});
