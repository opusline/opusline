<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\Locale;
use App\Domain\Users\Enums\SecurityAlertKind;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\SecurityAlert;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Notification;

const FIREFOX_ON_LINUX = 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0';

beforeEach(function (): void {
    freezeTodayAtUtcNoon();
    fakePasskeyCeremony();
});

function passSecondFactorChallenge(User $user, array $answer): void
{
    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertAccepted();
    fromSpa()->postJson('/api/two-factor-challenge', $answer)->assertOk();
}

function changePasswordOf(User $user): void
{
    withConfirmedPassword($user)
        ->putJson('/api/user/password', ['password' => 'a-brand-new-password', 'password_confirmation' => 'a-brand-new-password'])
        ->assertNoContent();
}

dataset('changes to the way in', [
    'password changed' => [SecurityAlertKind::PasswordChanged, changePasswordOf(...)],
    'sign-in email changed' => [SecurityAlertKind::EmailChanged, function (User $user): void {
        withConfirmedPassword($user)->putJson('/api/user/email', ['email' => 'somewhere-else@example.com'])->assertOk();
    }],
    'authenticator app turned on' => [SecurityAlertKind::TotpEnabled, function (User $user): void {
        $secret = withConfirmedPassword($user)->postJson('/api/user/two-factor/totp')->json('secret');

        fromSpa()->actingAs($user)
            ->postJson('/api/user/two-factor/totp/confirm', ['code' => totpCodeFor($secret)])
            ->assertOk();
    }],
    'authenticator app turned off' => [SecurityAlertKind::TotpDisabled, function (User $user): void {
        enableTotp($user);

        withConfirmedPassword($user)->deleteJson('/api/user/two-factor/totp')->assertSuccessful();
    }],
    'passkey added' => [SecurityAlertKind::PasskeyAdded, function (User $user): void {
        $options = withConfirmedPassword($user)->postJson('/api/user/passkeys/options');

        withConfirmedPassword($user)
            ->postJson('/api/user/passkeys', ['name' => 'YubiKey', 'credential' => fakeCredentialFor($options, 'cred-yubikey')])
            ->assertCreated();
    }],
    'passkey removed' => [SecurityAlertKind::PasskeyRemoved, function (User $user): void {
        $passkey = registerPasskey($user);

        withConfirmedPassword($user)->deleteJson("/api/user/passkeys/{$passkey->id}")->assertSuccessful();
    }],
    'browser trusted' => [SecurityAlertKind::BrowserTrusted, function (User $user): void {
        $secret = enableTotp($user);

        passSecondFactorChallenge($user, ['code' => totpCodeFor($secret), 'trustDevice' => true]);
    }],
    'recovery code used' => [SecurityAlertKind::RecoveryCodeUsed, function (User $user): void {
        enableTotp($user);

        passSecondFactorChallenge($user, ['recoveryCode' => ($user->refresh()->two_factor_recovery_codes ?? [])[0]]);
    }],
    'recovery codes regenerated' => [SecurityAlertKind::RecoveryCodesRegenerated, function (User $user): void {
        enableTotp($user);

        withConfirmedPassword($user)->postJson('/api/user/two-factor/recovery-codes')->assertOk();
    }],
    'security alerts turned off' => [SecurityAlertKind::AlertsTurnedOff, function (User $user): void {
        test()->actingAs($user)
            ->putJson('/api/settings/notifications', ['securityAlerts' => false, 'deadlineReminders' => true])
            ->assertOk();
    }],
]);

test('the owner is emailed once when the way into the account changes', function (SecurityAlertKind $kind, Closure $trigger): void {
    Notification::fake();
    $user = User::factory()->create();

    $trigger($user);

    Notification::assertSentToTimes($user, SecurityAlert::class, 1);
    Notification::assertSentTo($user, SecurityAlert::class, fn (SecurityAlert $alert): bool => $alert->kind === $kind);
})->with('changes to the way in');

test('an account that turned security alerts off receives none', function (): void {
    Notification::fake();
    $user = User::factory()->create();
    $user->settings()->sole()->update(['mail_security_alerts' => false]);

    changePasswordOf($user);

    Notification::assertNothingSent();
});

test('no alert leaves an instance that has no mailer', function (): void {
    Notification::fake();
    config()->set('mail.enabled', false);

    changePasswordOf(User::factory()->create());

    Notification::assertNothingSent();
});

test('saving the preferences without turning the alerts off sends nothing', function (bool $wasOn): void {
    Notification::fake();
    $user = User::factory()->create();
    $user->settings()->sole()->update(['mail_security_alerts' => $wasOn]);

    $this->actingAs($user)
        ->putJson('/api/settings/notifications', ['securityAlerts' => $wasOn, 'deadlineReminders' => false])
        ->assertOk();

    Notification::assertNothingSent();
})->with(['alerts left on' => true, 'alerts left off' => false]);

test('a changed sign-in email is reported to the address it replaced, naming the new one', function (): void {
    $user = User::factory()->create(['email' => 'before@example.com']);

    withConfirmedPassword($user)->putJson('/api/user/email', ['email' => 'after@example.com'])->assertOk();

    $mail = soleSentMail();

    expect($mail->getTo())->toHaveCount(1)
        ->and($mail->getTo()[0]->getAddress())->toBe('before@example.com')
        ->and($mail->getSubject())->toBe(__('mail.security.kind.EmailChanged.subject'))
        ->and($mail->getTextBody())->toContain('after@example.com');
});

test('every other alert goes to the address the account signs in with', function (): void {
    $user = User::factory()->create(['email' => 'theo@example.com']);

    changePasswordOf($user);

    expect(soleSentMail()->getTo()[0]->getAddress())->toBe('theo@example.com');
});

test('the alert about turning alerts off is delivered although they are off by then', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings/notifications', ['securityAlerts' => false, 'deadlineReminders' => true])
        ->assertOk();

    $mail = soleSentMail();

    expect($mail->getSubject())->toBe(__('mail.security.kind.AlertsTurnedOff.subject'))
        ->and($user->settings()->sole()->mail_security_alerts)->toBeFalse();
});

test('the alert tells the owner what happened, when and from where, in their language', function (): void {
    CarbonImmutable::setTestNow('2026-10-06 12:00:00');
    config()->set('app.frontend_url', 'https://opusline.example');
    $user = User::factory()->create();
    $user->settings()->sole()->update(['locale' => Locale::fr_FR, 'timezone' => 'Europe/Paris']);

    withConfirmedPassword($user)
        ->withServerVariables(['REMOTE_ADDR' => '203.0.113.7'])
        ->withHeader('User-Agent', FIREFOX_ON_LINUX)
        ->putJson('/api/user/password', ['password' => 'a-brand-new-password', 'password_confirmation' => 'a-brand-new-password'])
        ->assertNoContent();

    $mail = soleSentMail();

    expect($mail->getTo()[0]->getAddress())->toBe($user->email)
        ->and($mail->getSubject())->toBe(__('mail.security.kind.PasswordChanged.subject', locale: 'fr'))
        ->and($mail->getTextBody())
        ->toContain('6 octobre 2026 14:00 (Europe/Paris)')
        ->toContain('Firefox (Linux)')
        ->toContain('203.0.113.7')
        ->toContain('https://opusline.example/settings?tab=securite');
});

test('every alert has its copy in both languages', function (SecurityAlertKind $kind, Locale $locale): void {
    expect(Lang::has("mail.security.kind.{$kind->name}.subject", $locale->languageTag(), fallback: false))->toBeTrue()
        ->and(Lang::has("mail.security.kind.{$kind->name}.line", $locale->languageTag(), fallback: false))->toBeTrue();
})->with(SecurityAlertKind::cases())->with(Locale::cases());
