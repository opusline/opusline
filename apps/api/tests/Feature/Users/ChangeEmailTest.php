<?php

declare(strict_types=1);

use App\Domain\TwoFactor\Actions\IssueTrustedDevice;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Auth;

const OLD_EMAIL = 'before@example.com';
const NEW_EMAIL = 'after@example.com';

function userSigningInWithOldEmail(array $attributes = []): User
{
    return User::factory()->create(['email' => OLD_EMAIL, ...$attributes]);
}

test('the sign-in email changes once the password is confirmed', function (): void {
    $user = userSigningInWithOldEmail();

    withConfirmedPassword($user)
        ->putJson('/api/user/email', ['email' => NEW_EMAIL])
        ->assertOk()
        ->assertJsonPath('email', NEW_EMAIL);

    expect($user->refresh()->email)->toBe(NEW_EMAIL);
});

test('changing the email asks for the password first', function (): void {
    $user = userSigningInWithOldEmail();

    fromSpa()->actingAs($user)
        ->putJson('/api/user/email', ['email' => NEW_EMAIL])
        ->assertStatus(423);

    expect($user->refresh()->email)->toBe(OLD_EMAIL);
});

test('the new email is held to the registration rules', function (array $payload): void {
    User::factory()->create(['email' => 'taken@example.com']);

    withConfirmedPassword(userSigningInWithOldEmail())
        ->putJson('/api/user/email', $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors('email');
})->with([
    'not an address' => [['email' => 'not-an-address']],
    'uppercase' => [['email' => 'After@Example.com']],
    'taken by another account' => [['email' => 'taken@example.com']],
    'the address already in use' => [['email' => OLD_EMAIL]],
    'missing' => [[]],
]);

test('the new address signs in after the change', function (): void {
    withConfirmedPassword(userSigningInWithOldEmail())
        ->putJson('/api/user/email', ['email' => NEW_EMAIL])
        ->assertOk();

    fromSpa()
        ->postJson('/api/login', ['email' => NEW_EMAIL, 'password' => 'password'])
        ->assertOk();
});

test('the old address no longer signs in after the change', function (): void {
    withConfirmedPassword(userSigningInWithOldEmail())
        ->putJson('/api/user/email', ['email' => NEW_EMAIL])
        ->assertOk();

    fromSpa()
        ->postJson('/api/login', ['email' => OLD_EMAIL, 'password' => 'password'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

test('another session of the account stays signed in after the email changes', function (): void {
    $user = userSigningInWithOldEmail();
    $passwordHash = Auth::guard('web')->hashPasswordForCookie($user->password);

    withConfirmedPassword($user)->putJson('/api/user/email', ['email' => NEW_EMAIL])->assertOk();

    fromSpa()->actingAs($user->refresh())
        ->withSession(['password_hash_web' => $passwordHash])
        ->getJson('/api/user')
        ->assertOk()
        ->assertJsonPath('email', NEW_EMAIL);
});

test('email changes are rationed like registrations', function (): void {
    $user = userSigningInWithOldEmail();

    foreach (range(1, 6) as $attempt) {
        withConfirmedPassword($user)
            ->putJson('/api/user/email', ['email' => "attempt-{$attempt}@example.com"])
            ->assertOk();
    }

    withConfirmedPassword($user)
        ->putJson('/api/user/email', ['email' => NEW_EMAIL])
        ->assertTooManyRequests();
});

test('changing the email voids every remember-me cookie', function (): void {
    $user = userSigningInWithOldEmail(['remember_token' => 'remembered-before-the-change']);

    withConfirmedPassword($user)->putJson('/api/user/email', ['email' => NEW_EMAIL])->assertOk();

    expect($user->refresh()->remember_token)->not->toBe('remembered-before-the-change');
});

test('a browser that asked to be remembered gets a fresh remember-me cookie after an email change', function (): void {
    $recaller = Auth::guard('web')->getRecallerName();

    withConfirmedPassword(userSigningInWithOldEmail())
        ->withCookie($recaller, 'the-old-cookie')
        ->putJson('/api/user/email', ['email' => NEW_EMAIL])
        ->assertOk()
        ->assertCookie($recaller);
});

test('changing the email forgets every trusted browser', function (): void {
    $user = userSigningInWithOldEmail();
    enableTotp($user);
    app(IssueTrustedDevice::class)->handle($user, 'Firefox', '203.0.113.7');

    withConfirmedPassword($user)->putJson('/api/user/email', ['email' => NEW_EMAIL])->assertOk();

    expect($user->trustedDevices()->count())->toBe(0);
});

test('guests cannot change an email', function (): void {
    fromSpa()->putJson('/api/user/email', ['email' => NEW_EMAIL])->assertUnauthorized();
});
