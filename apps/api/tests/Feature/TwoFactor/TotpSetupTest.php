<?php

declare(strict_types=1);

use App\Domain\TwoFactor\Totp\TotpSecret;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('starting the setup returns a fresh secret and its otpauth uri', function (): void {
    $user = User::factory()->create();

    $response = withConfirmedPassword($user)->postJson('/api/user/two-factor/totp')->assertOk();

    $secret = $response->json('secret');

    expect($secret)->toBeString()->toMatch('/^[A-Z2-7]{32}$/')
        ->and($response->json('otpauthUri'))
        ->toStartWith('otpauth://totp/')
        ->toContain('secret='.$secret)
        ->toContain('issuer='.rawurlencode(config()->string('app.name')))
        ->toContain(rawurlencode($user->email));

    $user->refresh();

    expect($user->totp_secret)->toBe($secret)
        ->and($user->totp_confirmed_at)->toBeNull()
        ->and($user->hasTotpEnabled())->toBeFalse();
});

test('starting the setup again replaces the pending secret', function (): void {
    $user = User::factory()->create();

    $first = withConfirmedPassword($user)->postJson('/api/user/two-factor/totp')->json('secret');
    $second = withConfirmedPassword($user)->postJson('/api/user/two-factor/totp')->json('secret');

    expect($second)->not->toBe($first)
        ->and($user->refresh()->totp_secret)->toBe($second);
});

test('starting the setup is refused once the authenticator is enabled', function (): void {
    $user = User::factory()->create();
    enableTotp($user);

    withConfirmedPassword($user)
        ->postJson('/api/user/two-factor/totp')
        ->assertConflict()
        ->assertJsonPath('message', __('two-factor.already_enabled'));
});

test('confirming with the current code enables the authenticator and returns the recovery codes', function (): void {
    $user = User::factory()->create();
    $secret = withConfirmedPassword($user)->postJson('/api/user/two-factor/totp')->json('secret');

    $response = fromSpa()->actingAs($user)
        ->postJson('/api/user/two-factor/totp/confirm', ['code' => totpCodeFor($secret)])
        ->assertOk();

    expect($response->json('codes'))->toHaveCount(8)->each->toMatch('/^[A-Za-z0-9]{10}-[A-Za-z0-9]{10}$/');

    $user->refresh();

    expect($user->hasTotpEnabled())->toBeTrue()
        ->and($user->totp_last_used_step)->toBe(intdiv(now()->getTimestamp(), TotpSecret::totp($secret)->getPeriod()))
        ->and($user->two_factor_recovery_codes)->toBe($response->json('codes'));

    fromSpa()->actingAs($user)->getJson('/api/user/two-factor')->assertExactJson([
        'totpEnabled' => true,
        'totpConfirmedAt' => now()->toIso8601String(),
        'recoveryCodesRemaining' => 8,
        'trustedDevices' => [],
    ]);
});

test('confirming tolerates one step of clock drift on either side', function (int $driftSeconds): void {
    $user = User::factory()->create();
    $secret = withConfirmedPassword($user)->postJson('/api/user/two-factor/totp')->json('secret');

    fromSpa()->actingAs($user)
        ->postJson('/api/user/two-factor/totp/confirm', [
            'code' => totpCodeFor($secret, now()->getTimestamp() + $driftSeconds),
        ])
        ->assertOk();
})->with(['previous step' => -30, 'next step' => 30]);

test('confirming with a wrong code leaves the authenticator disabled', function (): void {
    $user = User::factory()->create();
    withConfirmedPassword($user)->postJson('/api/user/two-factor/totp');

    fromSpa()->actingAs($user)
        ->postJson('/api/user/two-factor/totp/confirm', ['code' => '000000'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('code');

    expect($user->refresh()->hasTotpEnabled())->toBeFalse();
});

test('confirming with a code two steps away is refused', function (int $driftSeconds): void {
    $user = User::factory()->create();
    $secret = withConfirmedPassword($user)->postJson('/api/user/two-factor/totp')->json('secret');

    fromSpa()->actingAs($user)
        ->postJson('/api/user/two-factor/totp/confirm', [
            'code' => totpCodeFor($secret, now()->getTimestamp() + $driftSeconds),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('code');

    expect($user->refresh()->hasTotpEnabled())->toBeFalse();
})->with(['two steps old' => -60, 'two steps ahead' => 60]);

test('confirming rejects anything but six digits before touching the secret', function (mixed $code): void {
    $user = User::factory()->create();
    withConfirmedPassword($user)->postJson('/api/user/two-factor/totp');

    fromSpa()->actingAs($user)
        ->postJson('/api/user/two-factor/totp/confirm', ['code' => $code])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('code');
})->with(['12345', '1234567', 'abcdef', '', null]);

test('confirming without a pending setup is refused', function (): void {
    $user = User::factory()->create();

    fromSpa()->actingAs($user)
        ->postJson('/api/user/two-factor/totp/confirm', ['code' => '123456'])
        ->assertConflict()
        ->assertJsonPath('message', __('two-factor.setup_not_started'));
});

test('confirming an already enabled authenticator is refused', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);

    fromSpa()->actingAs($user)
        ->postJson('/api/user/two-factor/totp/confirm', ['code' => totpCodeFor($secret)])
        ->assertConflict()
        ->assertJsonPath('message', __('two-factor.already_enabled'));
});

test('confirmation attempts are rate limited', function (): void {
    $user = User::factory()->create();
    $secret = withConfirmedPassword($user)->postJson('/api/user/two-factor/totp')->json('secret');

    foreach (range(1, 6) as $attempt) {
        fromSpa()->actingAs($user)
            ->postJson('/api/user/two-factor/totp/confirm', ['code' => '000000'])
            ->assertUnprocessable();
    }

    fromSpa()->actingAs($user)
        ->postJson('/api/user/two-factor/totp/confirm', ['code' => totpCodeFor($secret)])
        ->assertTooManyRequests();
});

test('disabling clears the secret and the recovery codes', function (): void {
    $user = User::factory()->create();
    enableTotp($user);

    withConfirmedPassword($user)->deleteJson('/api/user/two-factor/totp')->assertNoContent();

    $user->refresh();

    expect($user->totp_secret)->toBeNull()
        ->and($user->totp_confirmed_at)->toBeNull()
        ->and($user->totp_last_used_step)->toBeNull()
        ->and($user->two_factor_recovery_codes)->toBeNull();

    fromSpa()->actingAs($user)->getJson('/api/user/two-factor')->assertExactJson([
        'totpEnabled' => false,
        'totpConfirmedAt' => null,
        'recoveryCodesRemaining' => 0,
        'trustedDevices' => [],
    ]);
});

test('disabling cancels a setup that was never confirmed', function (): void {
    $user = User::factory()->create();
    withConfirmedPassword($user)->postJson('/api/user/two-factor/totp');

    withConfirmedPassword($user)->deleteJson('/api/user/two-factor/totp')->assertNoContent();

    expect($user->refresh()->totp_secret)->toBeNull();
});

test('the status never carries the secret', function (): void {
    $user = User::factory()->create();
    enableTotp($user);

    $response = fromSpa()->actingAs($user)->getJson('/api/user/two-factor')->assertOk();

    expect($response->json())->toHaveKeys(['totpEnabled', 'totpConfirmedAt', 'recoveryCodesRemaining'])
        ->not->toHaveKey('secret');
});
