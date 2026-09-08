<?php

declare(strict_types=1);

use App\Domain\Passkeys\Models\Passkey;
use App\Domain\Users\Models\User;
use App\Http\Passkeys\Support\PasskeyChallenge;

beforeEach(function (): void {
    freezeTodayAtUtcNoon();
    fakePasskeyCeremony();
});

test('the registration options mint the user handle once and exclude the registered passkeys', function (): void {
    $user = User::factory()->create();

    $first = withConfirmedPassword($user)->postJson('/api/user/passkeys/options')->assertOk();
    $handle = $user->refresh()->passkey_user_handle;

    expect($handle)->toBeString()->toMatch('/^[A-Za-z0-9_-]{43}$/')
        ->and($first->json('options.user.id'))->toBe($handle)
        ->and($first->json('options.excludeCredentials'))->toBe([]);

    $registered = registerPasskey($user);

    $second = withConfirmedPassword($user)->postJson('/api/user/passkeys/options')->assertOk();

    expect($user->refresh()->passkey_user_handle)->toBe($handle)
        ->and($second->json('options.excludeCredentials.0.id'))->toBe($registered->credential_id);
});

test('a verified credential registers a passkey and mints the recovery codes', function (): void {
    $user = User::factory()->create();
    $options = withConfirmedPassword($user)->postJson('/api/user/passkeys/options');

    $response = withConfirmedPassword($user)
        ->postJson('/api/user/passkeys', [
            'name' => 'MacBook de Théo',
            'credential' => fakeCredentialFor($options, 'cred-macbook'),
        ])
        ->assertCreated()
        ->assertJsonPath('name', 'MacBook de Théo')
        ->assertJsonPath('backedUp', true)
        ->assertJsonPath('lastUsedAt', null);

    $passkey = $user->passkeys()->sole();

    expect($passkey->credential_id)->toBe('cred-macbook')
        ->and($passkey->id)->toBe($response->json('id'))
        ->and($user->refresh()->two_factor_recovery_codes)->toHaveCount(8)
        ->and($user->hasTwoFactorEnabled())->toBeTrue();

    withConfirmedPassword($user)->getJson('/api/user/two-factor')
        ->assertJsonPath('passkeys.0.id', $passkey->id)
        ->assertJsonPath('recoveryCodesRemaining', 8);
});

test('registering a second passkey keeps the recovery codes', function (): void {
    $user = User::factory()->create();
    registerPasskey($user);
    $codes = $user->refresh()->two_factor_recovery_codes;
    $options = withConfirmedPassword($user)->postJson('/api/user/passkeys/options');

    withConfirmedPassword($user)
        ->postJson('/api/user/passkeys', ['name' => 'YubiKey', 'credential' => fakeCredentialFor($options, 'cred-yubikey')])
        ->assertCreated();

    expect($user->refresh()->two_factor_recovery_codes)->toBe($codes)
        ->and($user->passkeys()->count())->toBe(2);
});

test('a credential answering another challenge is refused', function (): void {
    $user = User::factory()->create();
    withConfirmedPassword($user)->postJson('/api/user/passkeys/options');

    withConfirmedPassword($user)
        ->postJson('/api/user/passkeys', [
            'name' => 'MacBook',
            'credential' => json_encode(['id' => 'cred-macbook', 'challenge' => 'not-the-challenge']),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('credential');

    expect($user->passkeys()->count())->toBe(0);
});

test('the registration options are single use and expire', function (string $reason): void {
    $user = User::factory()->create();
    $options = withConfirmedPassword($user)->postJson('/api/user/passkeys/options');
    $credential = fakeCredentialFor($options, 'cred-macbook');

    if ($reason === 'expired') {
        $this->travel(PasskeyChallenge::TTL_SECONDS)->seconds();
    } else {
        withConfirmedPassword($user)->postJson('/api/user/passkeys', ['name' => 'A', 'credential' => $credential])->assertCreated();
        $credential = fakeCredentialFor($options, 'cred-other');
    }

    withConfirmedPassword($user)
        ->postJson('/api/user/passkeys', ['name' => 'B', 'credential' => $credential])
        ->assertUnprocessable()
        ->assertJsonPath('errors.credential.0', __('passkeys.challenge_expired'));
})->with(['expired', 'already used']);

test('a credential id already registered anywhere is refused', function (): void {
    $other = User::factory()->create();
    registerPasskey($other, fn ($factory) => $factory->state(['credential_id' => 'cred-shared']));
    $user = User::factory()->create();
    $options = withConfirmedPassword($user)->postJson('/api/user/passkeys/options');

    withConfirmedPassword($user)
        ->postJson('/api/user/passkeys', ['name' => 'Copy', 'credential' => fakeCredentialFor($options, 'cred-shared')])
        ->assertUnprocessable()
        ->assertJsonPath('errors.credential.0', __('passkeys.already_registered'));
});

test('the name is required and bounded', function (mixed $name): void {
    $user = User::factory()->create();
    $options = withConfirmedPassword($user)->postJson('/api/user/passkeys/options');

    withConfirmedPassword($user)
        ->postJson('/api/user/passkeys', ['name' => $name, 'credential' => fakeCredentialFor($options, 'cred')])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('name');
})->with(['', null, str_repeat('x', 101)]);

test('a passkey can be renamed', function (): void {
    $user = User::factory()->create();
    $passkey = registerPasskey($user);

    fromSpa()->actingAs($user)
        ->putJson("/api/user/passkeys/{$passkey->id}", ['name' => 'Clé du bureau'])
        ->assertOk()
        ->assertJsonPath('name', 'Clé du bureau');

    expect($passkey->refresh()->name)->toBe('Clé du bureau');
});

test('deleting the last passkey clears the recovery codes and the trusted browsers', function (): void {
    $user = User::factory()->create();
    $passkey = registerPasskey($user);
    $user->trustedDevices()->create([
        'token_hash' => hash('sha256', 'token'),
        'expires_at' => now()->addDays(30),
    ]);

    withConfirmedPassword($user)->deleteJson("/api/user/passkeys/{$passkey->id}")->assertNoContent();

    $user->refresh();

    expect($user->passkeys()->count())->toBe(0)
        ->and($user->two_factor_recovery_codes)->toBeNull()
        ->and($user->trustedDevices()->count())->toBe(0)
        ->and($user->hasTwoFactorEnabled())->toBeFalse();
});

test('deleting a passkey while the authenticator stays on keeps the recovery codes', function (): void {
    $user = User::factory()->create();
    enableTotp($user);
    $passkey = registerPasskey($user);
    $codes = $user->refresh()->two_factor_recovery_codes;

    withConfirmedPassword($user)->deleteJson("/api/user/passkeys/{$passkey->id}")->assertNoContent();

    expect($user->refresh()->two_factor_recovery_codes)->toBe($codes)
        ->and($user->hasTwoFactorEnabled())->toBeTrue();
});

test('disabling the authenticator keeps the recovery codes while a passkey remains', function (): void {
    $user = User::factory()->create();
    enableTotp($user);
    registerPasskey($user);
    $codes = $user->refresh()->two_factor_recovery_codes;

    withConfirmedPassword($user)->deleteJson('/api/user/two-factor/totp')->assertNoContent();

    expect($user->refresh()->two_factor_recovery_codes)->toBe($codes);
});

test('another account\'s passkey cannot be renamed or deleted through this one', function (): void {
    $user = User::factory()->create();
    $foreign = registerPasskey(User::factory()->create());

    fromSpa()->actingAs($user)->putJson("/api/user/passkeys/{$foreign->id}", ['name' => 'Mine'])->assertNotFound();
    withConfirmedPassword($user)->deleteJson("/api/user/passkeys/{$foreign->id}")->assertNotFound();

    expect(Passkey::query()->whereKey($foreign->id)->exists())->toBeTrue();
});

test('registering and deleting require a confirmed password', function (string $method, string $uri): void {
    $user = User::factory()->create();
    registerPasskey($user, fn ($factory) => $factory->state(['id' => 41]));

    fromSpa()->actingAs($user)->json($method, $uri)->assertStatus(423);
})->with([
    'options' => ['POST', '/api/user/passkeys/options'],
    'store' => ['POST', '/api/user/passkeys'],
    'delete' => ['DELETE', '/api/user/passkeys/41'],
]);

test('a credential that is not a JSON object is refused', function (mixed $credential): void {
    $user = User::factory()->create();
    withConfirmedPassword($user)->postJson('/api/user/passkeys/options');

    withConfirmedPassword($user)
        ->postJson('/api/user/passkeys', ['name' => 'MacBook', 'credential' => $credential])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('credential');
})->with([
    'text' => ['not json'],
    'a JSON string' => ['"a string"'],
    'a JSON list' => ['[1, 2]'],
    'a nested payload' => [['nested' => 'array']],
    'nothing' => [null],
]);
