<?php

declare(strict_types=1);

use App\Domain\TwoFactor\Actions\IssueTrustedDevice;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

function newPasswordPayload(string $password = 'a-brand-new-password'): array
{
    return ['password' => $password, 'password_confirmation' => $password];
}

test('the password changes once the current one is confirmed', function (): void {
    $user = User::factory()->create();

    withConfirmedPassword($user)
        ->putJson('/api/user/password', newPasswordPayload())
        ->assertNoContent();

    expect(Hash::check('a-brand-new-password', $user->refresh()->password))->toBeTrue()
        ->and(Hash::check('password', $user->password))->toBeFalse();
});

test('changing the password asks for the current one first', function (): void {
    $user = User::factory()->create();

    fromSpa()->actingAs($user)
        ->putJson('/api/user/password', newPasswordPayload())
        ->assertStatus(423);

    expect(Hash::check('password', $user->refresh()->password))->toBeTrue();
});

test('the new password is held to the registration rules', function (array $payload): void {
    withConfirmedPassword(User::factory()->create())
        ->putJson('/api/user/password', $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors('password');
})->with([
    'too short' => [['password' => 'short', 'password_confirmation' => 'short']],
    'unconfirmed' => [['password' => 'a-brand-new-password', 'password_confirmation' => 'something-else']],
    'missing' => [[]],
]);

test('the session that changed the password stays signed in', function (): void {
    $user = User::factory()->create();

    withConfirmedPassword($user)->putJson('/api/user/password', newPasswordPayload())->assertNoContent();

    fromSpa()->getJson('/api/user')->assertOk();
});

test('another session opened with the old password is signed out', function (): void {
    $user = User::factory()->create();
    $oldPasswordHash = Auth::guard('web')->hashPasswordForCookie($user->password);

    withConfirmedPassword($user)->putJson('/api/user/password', newPasswordPayload())->assertNoContent();

    fromSpa()->actingAs($user->refresh())
        ->withSession(['password_hash_web' => $oldPasswordHash])
        ->getJson('/api/user')
        ->assertUnauthorized();
});

test('changing the password voids every remember-me cookie', function (): void {
    $user = User::factory()->create(['remember_token' => 'remembered-before-the-change']);

    withConfirmedPassword($user)->putJson('/api/user/password', newPasswordPayload())->assertNoContent();

    expect($user->refresh()->remember_token)->not->toBe('remembered-before-the-change');
});

test('a browser that asked to be remembered gets a fresh remember-me cookie', function (): void {
    $user = User::factory()->create();
    $recaller = Auth::guard('web')->getRecallerName();

    withConfirmedPassword($user)
        ->withCookie($recaller, 'the-old-cookie')
        ->putJson('/api/user/password', newPasswordPayload())
        ->assertNoContent()
        ->assertCookie($recaller);
});

test('changing the password forgets every trusted browser', function (): void {
    $user = User::factory()->create();
    enableTotp($user);
    app(IssueTrustedDevice::class)->handle($user, 'Firefox', '203.0.113.7');

    withConfirmedPassword($user)->putJson('/api/user/password', newPasswordPayload())->assertNoContent();

    expect($user->trustedDevices()->count())->toBe(0);
});

test('guests cannot change a password', function (): void {
    fromSpa()->putJson('/api/user/password', newPasswordPayload())->assertUnauthorized();
});
