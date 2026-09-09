<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use App\Http\Passkeys\Support\PasskeyChallenge;
use App\Http\Users\Support\RequirePasswordConfirmation;
use Illuminate\Support\Facades\Auth;

beforeEach(function (): void {
    freezeTodayAtUtcNoon();
    fakePasskeyCeremony();
});

test('the login options name no account and require user verification', function (): void {
    fromSpa()->postJson('/api/passkeys/login/options')
        ->assertOk()
        ->assertJsonPath('options.allowCredentials', [])
        ->assertJsonPath('options.userVerification', 'required');
});

test('a verified assertion signs the account in without a password or a challenge', function (): void {
    $user = User::factory()->create();
    enableTotp($user);
    $passkey = registerPasskey($user);
    $options = fromSpa()->postJson('/api/passkeys/login/options');

    fromSpa()->postJson('/api/passkeys/login', [
        'credential' => fakeCredentialFor($options, $passkey->credential_id, ['counter' => 7]),
    ])
        ->assertOk()
        ->assertJsonPath('email', $user->email)
        ->assertCookieMissing(Auth::guard('web')->getRecallerName());

    $this->assertAuthenticatedAs($user, 'web');

    $passkey->refresh();

    expect($passkey->counter)->toBe(7)
        ->and($passkey->last_used_at?->toIso8601String())->toBe(now()->toIso8601String());
});

test('a passkey login can remember the user', function (): void {
    $user = User::factory()->create();
    $passkey = registerPasskey($user);
    $options = fromSpa()->postJson('/api/passkeys/login/options');

    fromSpa()->postJson('/api/passkeys/login', [
        'credential' => fakeCredentialFor($options, $passkey->credential_id),
        'remember' => true,
    ])->assertOk()->assertCookie(Auth::guard('web')->getRecallerName());
});

test('a passkey login does not open the password confirmation window', function (): void {
    $user = User::factory()->create();
    $passkey = registerPasskey($user);
    $options = fromSpa()->postJson('/api/passkeys/login/options');

    fromSpa()->postJson('/api/passkeys/login', ['credential' => fakeCredentialFor($options, $passkey->credential_id)])->assertOk();

    expect(session()->has(RequirePasswordConfirmation::SESSION_KEY))->toBeFalse();
    fromSpa()->postJson('/api/user/two-factor/totp')->assertStatus(423);
});

test('the login regenerates the session id', function (): void {
    $user = User::factory()->create();
    $passkey = registerPasskey($user);
    $options = fromSpa()->postJson('/api/passkeys/login/options');
    $guestSessionId = session()->getId();

    fromSpa()->postJson('/api/passkeys/login', ['credential' => fakeCredentialFor($options, $passkey->credential_id)])->assertOk();

    expect(session()->getId())->not->toBe($guestSessionId);
});

test('an unknown credential is refused', function (): void {
    $options = fromSpa()->postJson('/api/passkeys/login/options');

    fromSpa()->postJson('/api/passkeys/login', ['credential' => fakeCredentialFor($options, 'cred-nobody')])
        ->assertUnprocessable()
        ->assertJsonPath('errors.credential.0', __('passkeys.login_failed'));

    $this->assertGuest('web');
});

test('an assertion for another account\'s handle is refused', function (): void {
    $user = User::factory()->create();
    $passkey = registerPasskey($user);
    $options = fromSpa()->postJson('/api/passkeys/login/options');

    fromSpa()->postJson('/api/passkeys/login', [
        'credential' => fakeCredentialFor($options, $passkey->credential_id, ['userHandle' => 'someone-else']),
    ])->assertUnprocessable()->assertJsonValidationErrors('credential');

    $this->assertGuest('web');
});

test('a replayed signature counter is refused', function (): void {
    $user = User::factory()->create();
    $passkey = registerPasskey($user, fn ($factory) => $factory->state(['counter' => 5]));
    $options = fromSpa()->postJson('/api/passkeys/login/options');

    fromSpa()->postJson('/api/passkeys/login', [
        'credential' => fakeCredentialFor($options, $passkey->credential_id, ['counter' => 5]),
    ])->assertUnprocessable()->assertJsonValidationErrors('credential');

    $this->assertGuest('web');
    expect($passkey->refresh()->counter)->toBe(5);
});

test('the login options are single use and expire', function (string $reason): void {
    $user = User::factory()->create();
    $passkey = registerPasskey($user);
    $options = fromSpa()->postJson('/api/passkeys/login/options');
    $credential = fakeCredentialFor($options, $passkey->credential_id);

    if ($reason === 'expired') {
        $this->travel(PasskeyChallenge::TTL_SECONDS)->seconds();
    } else {
        fromSpa()->postJson('/api/passkeys/login', ['credential' => $credential])->assertOk();
        fromSpa()->postJson('/api/logout')->assertNoContent();
    }

    fromSpa()->postJson('/api/passkeys/login', ['credential' => $credential])
        ->assertUnprocessable()
        ->assertJsonPath('errors.credential.0', __('passkeys.challenge_expired'));
})->with(['expired', 'already used']);

test('passkey logins are rate limited per address', function (): void {
    foreach (range(1, 10) as $attempt) {
        fromSpa()->postJson('/api/passkeys/login', ['credential' => '{"id":"cred"}'])->assertUnprocessable();
    }

    fromSpa()->postJson('/api/passkeys/login', ['credential' => '{"id":"cred"}'])->assertTooManyRequests();
    fromSpa()->postJson('/api/passkeys/login/options')->assertTooManyRequests();
});
