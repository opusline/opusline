<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\Locale;
use App\Domain\TwoFactor\Actions\IssueTrustedDevice;
use App\Domain\Users\Enums\SecurityAlertKind;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\ResetPasswordLink;
use App\Domain\Users\Notifications\SecurityAlert;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

const NEW_PASSWORD = 'a-brand-new-password';

/** Asks for a link the way the SPA does and hands back the token that was emailed. */
function resetTokenEmailedTo(User $user): string
{
    Notification::fake();

    fromSpa()->postJson('/api/forgot-password', ['email' => $user->email])->assertNoContent();

    $token = '';

    Notification::assertSentTo($user, ResetPasswordLink::class, function (ResetPasswordLink $link) use (&$token): bool {
        $token = $link->token;

        return true;
    });

    return $token;
}

/** @return array<string, string> */
function resetPayload(User $user, string $token, string $password = NEW_PASSWORD): array
{
    return [
        'token' => $token,
        'email' => $user->email,
        'password' => $password,
        'password_confirmation' => $password,
    ];
}

test('asking for a reset emails a link to the account', function (): void {
    Notification::fake();
    $user = User::factory()->create();

    fromSpa()->postJson('/api/forgot-password', ['email' => $user->email])->assertNoContent();

    Notification::assertSentToTimes($user, ResetPasswordLink::class, 1);
});

test('asking for an unknown address answers the same and emails nobody', function (): void {
    Notification::fake();
    User::factory()->create();

    fromSpa()->postJson('/api/forgot-password', ['email' => 'nobody@example.com'])->assertNoContent();

    Notification::assertNothingSent();
});

test('the emailed link opens the reset page of the app, in the language of the account', function (): void {
    config()->set('app.frontend_url', 'https://opusline.example');
    $user = User::factory()->create(['email' => 'theo+reset@example.com']);
    $user->settings()->sole()->update(['locale' => Locale::fr_FR]);

    fromSpa()->postJson('/api/forgot-password', ['email' => $user->email])->assertNoContent();

    $mail = soleSentMail();

    expect($mail->getTo()[0]->getAddress())->toBe($user->email)
        ->and($mail->getSubject())->toBe(__('mail.password_reset.subject', locale: 'fr'))
        ->and($mail->getTextBody())
        ->toMatch('#https://opusline\.example/reset-password\?token=[a-f0-9]{64}&email=theo%2Breset%40example\.com#');
});

test('the emailed token sets a new password', function (): void {
    $user = User::factory()->create();

    fromSpa()->postJson('/api/reset-password', resetPayload($user, resetTokenEmailedTo($user)))->assertNoContent();

    expect(Hash::check(NEW_PASSWORD, $user->refresh()->password))->toBeTrue();
});

test('resetting the password signs nobody in', function (): void {
    $user = User::factory()->create();

    fromSpa()->postJson('/api/reset-password', resetPayload($user, resetTokenEmailedTo($user)))->assertNoContent();

    $this->assertGuest('web');
});

test('a reset revokes what outlived the old password and tells the owner', function (): void {
    $user = User::factory()->create();
    $user->setRememberToken('remember-me-from-before');
    $user->save();
    app(IssueTrustedDevice::class)->handle($user, userAgent: null, ip: null);
    $token = resetTokenEmailedTo($user);

    fromSpa()->postJson('/api/reset-password', resetPayload($user, $token))->assertNoContent();

    expect($user->refresh()->getRememberToken())->not->toBe('remember-me-from-before')
        ->and($user->trustedDevices()->count())->toBe(0);
    Notification::assertSentTo(
        $user,
        SecurityAlert::class,
        fn (SecurityAlert $alert): bool => $alert->kind === SecurityAlertKind::PasswordChanged,
    );
});

test('an account with a second factor is still challenged after a reset', function (): void {
    $user = User::factory()->create();
    enableTotp($user);

    fromSpa()->postJson('/api/reset-password', resetPayload($user, resetTokenEmailedTo($user)))->assertNoContent();

    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => NEW_PASSWORD])->assertAccepted();
    $this->assertGuest('web');
});

test('a token is spent by the reset it allowed', function (): void {
    $user = User::factory()->create();
    $token = resetTokenEmailedTo($user);

    fromSpa()->postJson('/api/reset-password', resetPayload($user, $token))->assertNoContent();
    fromSpa()->postJson('/api/reset-password', resetPayload($user, $token, 'yet-another-password'))
        ->assertJsonValidationErrorFor('token');

    expect(Hash::check(NEW_PASSWORD, $user->refresh()->password))->toBeTrue();
});

test('a token stops working once it has expired', function (): void {
    $user = User::factory()->create();
    $token = resetTokenEmailedTo($user);

    $this->travel(config()->integer('auth.passwords.users.expire') + 1)->minutes();

    fromSpa()->postJson('/api/reset-password', resetPayload($user, $token))->assertJsonValidationErrorFor('token');

    expect(Hash::check('password', $user->refresh()->password))->toBeTrue();
});

test('a token only resets the account it was emailed to', function (): void {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    fromSpa()->postJson('/api/reset-password', resetPayload($other, resetTokenEmailedTo($owner)))
        ->assertJsonValidationErrorFor('token');

    expect(Hash::check('password', $other->refresh()->password))->toBeTrue();
});

test('an unknown address and a wrong token are refused with the same answer', function (): void {
    $user = User::factory()->create();
    resetTokenEmailedTo($user);

    $wrongToken = fromSpa()->postJson('/api/reset-password', resetPayload($user, 'not-the-token'));
    $unknownAddress = fromSpa()->postJson('/api/reset-password', [
        ...resetPayload($user, 'not-the-token'),
        'email' => 'nobody@example.com',
    ]);

    expect($unknownAddress->status())->toBe($wrongToken->status())
        ->and($unknownAddress->json())->toBe($wrongToken->json());
});

test('the new password is held to the registration rules', function (array $password): void {
    $user = User::factory()->create();

    fromSpa()->postJson('/api/reset-password', [...resetPayload($user, resetTokenEmailedTo($user)), ...$password])
        ->assertJsonValidationErrorFor('password');

    expect(Hash::check('password', $user->refresh()->password))->toBeTrue();
})->with([
    'too short' => [['password' => 'short', 'password_confirmation' => 'short']],
    'not confirmed' => [['password' => NEW_PASSWORD, 'password_confirmation' => 'something-else']],
]);

test('an instance without a mailer has no password reset', function (string $path): void {
    config()->set('mail.enabled', false);

    fromSpa()->postJson($path, [])->assertNotFound();
})->with(['/api/forgot-password', '/api/reset-password']);

test('reset links are rationed per caller', function (): void {
    Notification::fake();

    foreach (range(1, 6) as $attempt) {
        fromSpa()->postJson('/api/forgot-password', ['email' => "someone-{$attempt}@example.com"])->assertNoContent();
    }

    fromSpa()->postJson('/api/forgot-password', ['email' => 'someone-7@example.com'])->assertTooManyRequests();
});

test('one address is only mailed so many links an hour, whoever asks', function (): void {
    Notification::fake();
    $user = User::factory()->create();

    foreach (range(1, 6) as $attempt) {
        fromSpa()->withServerVariables(['REMOTE_ADDR' => "203.0.113.{$attempt}"])
            ->postJson('/api/forgot-password', ['email' => $user->email])
            ->assertNoContent();
    }

    fromSpa()->withServerVariables(['REMOTE_ADDR' => '203.0.113.7'])
        ->postJson('/api/forgot-password', ['email' => $user->email])
        ->assertTooManyRequests();
});

test('a stranger asking for links cannot keep the owner from spending theirs', function (): void {
    $user = User::factory()->create();
    $token = resetTokenEmailedTo($user);

    foreach (range(1, 6) as $attempt) {
        fromSpa()->withServerVariables(['REMOTE_ADDR' => "203.0.113.{$attempt}"])
            ->postJson('/api/reset-password', resetPayload($user, 'a-guess'))
            ->assertUnprocessable();
    }

    fromSpa()->postJson('/api/reset-password', resetPayload($user, $token))->assertNoContent();
});

test('an address typed with capitals is refused rather than silently unmatched', function (): void {
    Notification::fake();
    User::factory()->create(['email' => 'theo@example.com']);

    fromSpa()->postJson('/api/forgot-password', ['email' => 'Theo@Example.com'])
        ->assertJsonValidationErrorFor('email');

    Notification::assertNothingSent();
});

test('spent and expired reset tokens are cleared by the scheduler', function (): void {
    $this->artisan('schedule:list')
        ->expectsOutputToContain('auth:clear-resets')
        ->assertSuccessful();
});
