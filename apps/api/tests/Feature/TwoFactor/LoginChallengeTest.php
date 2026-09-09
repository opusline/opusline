<?php

declare(strict_types=1);

use App\Domain\TwoFactor\Enums\TwoFactorMethod;
use App\Domain\Users\Models\User;
use App\Http\Users\Support\PendingLogin;
use Illuminate\Support\Facades\Auth;

beforeEach(fn () => freezeTodayAtUtcNoon());

function loginExpectingChallenge(User $user, bool $remember = false): void
{
    fromSpa()->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
        'remember' => $remember,
    ])->assertAccepted();
}

test('a correct password on an account with an authenticator answers the challenge, not a session', function (): void {
    $user = User::factory()->create();
    enableTotp($user);

    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])
        ->assertAccepted()
        ->assertExactJson([
            'twoFactorRequired' => true,
            'methods' => [TwoFactorMethod::Totp->value],
        ]);

    $this->assertGuest('web');
    expect(session()->get(PendingLogin::KEY_USER_ID))->toBe($user->id);
});

test('a wrong password answers the same way whether or not an authenticator is enabled', function (bool $enabled): void {
    $user = User::factory()->create();

    if ($enabled) {
        enableTotp($user);
    }

    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'not-the-password'])
        ->assertUnprocessable()
        ->assertExactJson([
            'message' => __('auth.failed'),
            'errors' => ['email' => [__('auth.failed')]],
        ]);

    $this->assertGuest('web');
    expect(session()->has(PendingLogin::KEY_USER_ID))->toBeFalse();
})->with(['enabled' => true, 'disabled' => false]);

test('the current authenticator code completes the login', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    loginExpectingChallenge($user);

    fromSpa()->postJson('/api/two-factor-challenge', ['code' => totpCodeFor($secret)])
        ->assertOk()
        ->assertJsonPath('email', $user->email)
        ->assertCookieMissing(Auth::guard('web')->getRecallerName());

    $this->assertAuthenticatedAs($user, 'web');
    expect(session()->has(PendingLogin::KEY_USER_ID))->toBeFalse();
});

test('the challenge honours the remember choice made at the password step', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    loginExpectingChallenge($user, remember: true);

    fromSpa()->postJson('/api/two-factor-challenge', ['code' => totpCodeFor($secret)])
        ->assertOk()
        ->assertCookie(Auth::guard('web')->getRecallerName());
});

test('the challenge opens the password confirmation window', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    loginExpectingChallenge($user);

    fromSpa()->postJson('/api/two-factor-challenge', ['code' => totpCodeFor($secret)])->assertOk();

    fromSpa()->getJson('/api/user/two-factor/recovery-codes')->assertOk();
});

test('the challenge regenerates the session id', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    loginExpectingChallenge($user);
    $pendingSessionId = session()->getId();

    fromSpa()->postJson('/api/two-factor-challenge', ['code' => totpCodeFor($secret)])->assertOk();

    expect(session()->getId())->not->toBe($pendingSessionId);
});

test('a code that already answered cannot answer again', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    $code = totpCodeFor($secret);

    loginExpectingChallenge($user);
    fromSpa()->postJson('/api/two-factor-challenge', ['code' => $code])->assertOk();

    fromSpa()->postJson('/api/logout')->assertNoContent();

    loginExpectingChallenge($user);
    fromSpa()->postJson('/api/two-factor-challenge', ['code' => $code])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('code');

    $this->assertGuest('web');
});

test('a recovery code completes the login and is spent', function (): void {
    $user = User::factory()->create();
    enableTotp($user);
    $codes = $user->refresh()->two_factor_recovery_codes ?? [];
    $spent = $codes[3];
    loginExpectingChallenge($user);

    fromSpa()->postJson('/api/two-factor-challenge', ['recoveryCode' => $spent])->assertOk();

    $this->assertAuthenticatedAs($user, 'web');
    expect($user->refresh()->two_factor_recovery_codes)->toHaveCount(7)->not->toContain($spent);
});

test('a spent recovery code is refused', function (): void {
    $user = User::factory()->create();
    enableTotp($user);
    $spent = ($user->refresh()->two_factor_recovery_codes ?? [])[0];

    loginExpectingChallenge($user);
    fromSpa()->postJson('/api/two-factor-challenge', ['recoveryCode' => $spent])->assertOk();
    fromSpa()->postJson('/api/logout')->assertNoContent();

    loginExpectingChallenge($user);
    fromSpa()->postJson('/api/two-factor-challenge', ['recoveryCode' => $spent])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('recoveryCode');

    $this->assertGuest('web');
});

test('the fifth wrong answer discards the pending login and says so', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    loginExpectingChallenge($user);

    foreach (range(1, PendingLogin::MAX_FAILURES - 1) as $attempt) {
        fromSpa()->postJson('/api/two-factor-challenge', ['code' => '000000'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('code');
    }

    fromSpa()->postJson('/api/two-factor-challenge', ['code' => '000000'])
        ->assertConflict()
        ->assertJsonPath('message', __('two-factor.too_many_failures'));

    fromSpa()->postJson('/api/two-factor-challenge', ['code' => totpCodeFor($secret)])
        ->assertConflict()
        ->assertJsonPath('message', __('two-factor.challenge_expired'));

    $this->assertGuest('web');
});

test('the pending login expires after five minutes', function (): void {
    $user = User::factory()->create();
    $secret = enableTotp($user);
    loginExpectingChallenge($user);

    $this->travel(PendingLogin::TTL_SECONDS)->seconds();

    fromSpa()->postJson('/api/two-factor-challenge', ['code' => totpCodeFor($secret)])
        ->assertConflict()
        ->assertJsonPath('message', __('two-factor.challenge_expired'));

    $this->assertGuest('web');
});

test('answering without a pending login is refused', function (): void {
    fromSpa()->postJson('/api/two-factor-challenge', ['code' => '123456'])
        ->assertConflict()
        ->assertJsonPath('message', __('two-factor.challenge_expired'));
});

test('the answer must carry a six-digit code or a recovery code', function (array $payload, string $field): void {
    $user = User::factory()->create();
    enableTotp($user);
    loginExpectingChallenge($user);

    fromSpa()->postJson('/api/two-factor-challenge', $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors($field);
})->with([
    'nothing' => [[], 'code'],
    'short code' => [['code' => '12345'], 'code'],
    'letters' => [['code' => 'abcdef'], 'code'],
    'malformed recovery code' => [['recoveryCode' => 'not-a-recovery-code'], 'recoveryCode'],
]);

test('challenge answers are rate limited per address once the pending login is gone', function (): void {
    $user = User::factory()->create();
    enableTotp($user);
    loginExpectingChallenge($user);

    // The fifth wrong answer discards the pending login; the answers after
    // that fall into the no-pending-login bucket, which allows ten a minute.
    foreach (range(1, PendingLogin::MAX_FAILURES + 10) as $attempt) {
        fromSpa()->postJson('/api/two-factor-challenge', ['code' => '000000'])
            ->assertStatus($attempt < PendingLogin::MAX_FAILURES ? 422 : 409);
    }

    fromSpa()->postJson('/api/two-factor-challenge', ['code' => '000000'])->assertTooManyRequests();
});

test('challenge answers for one pending login are rate limited before the failures run out', function (): void {
    $user = User::factory()->create();
    enableTotp($user);

    foreach (range(1, 3) as $round) {
        loginExpectingChallenge($user);

        foreach (range(1, 3) as $attempt) {
            fromSpa()->postJson('/api/two-factor-challenge', ['code' => '000000'])->assertUnprocessable();
        }
    }

    loginExpectingChallenge($user);

    fromSpa()->postJson('/api/two-factor-challenge', ['code' => '000000'])->assertUnprocessable();
    fromSpa()->postJson('/api/two-factor-challenge', ['code' => '000000'])->assertTooManyRequests();
});

test('an account without an authenticator still signs in with the password alone', function (): void {
    $user = User::factory()->create();

    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])
        ->assertOk()
        ->assertJsonPath('email', $user->email);

    $this->assertAuthenticatedAs($user, 'web');
});
