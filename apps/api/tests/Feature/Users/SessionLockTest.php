<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use App\Http\Users\Support\RequirePasswordConfirmation;

test('a locked session is refused like a lost one', function (): void {
    $user = User::factory()->create();

    fromSpa()->actingAs($user)->postJson('/api/user/session-lock')->assertNoContent();

    fromSpa()->getJson('/api/user')
        ->assertUnauthorized()
        ->assertJsonPath('message', __('two-factor.session_locked'));
    fromSpa()->getJson('/api/clients')->assertUnauthorized();
});

test('confirming the password unlocks the session', function (): void {
    $user = User::factory()->create();
    fromSpa()->actingAs($user)->postJson('/api/user/session-lock')->assertNoContent();

    fromSpa()->postJson('/api/user/confirm-password', ['password' => 'password'])->assertNoContent();

    fromSpa()->getJson('/api/user')->assertOk();
});

test('a wrong password leaves the session locked', function (): void {
    $user = User::factory()->create();
    fromSpa()->actingAs($user)->postJson('/api/user/session-lock')->assertNoContent();

    fromSpa()->postJson('/api/user/confirm-password', ['password' => 'not-the-password'])->assertUnprocessable();

    fromSpa()->getJson('/api/user')->assertUnauthorized();
});

test('locking closes the password confirmation window', function (): void {
    $user = User::factory()->create();

    withConfirmedPassword($user)->postJson('/api/user/session-lock')->assertNoContent();

    expect(session()->has(RequirePasswordConfirmation::SESSION_KEY))->toBeFalse();
});

test('a locked session can still sign out', function (): void {
    $user = User::factory()->create();
    fromSpa()->actingAs($user)->postJson('/api/user/session-lock')->assertNoContent();

    fromSpa()->postJson('/api/logout')->assertNoContent();

    $this->assertGuest('web');
});

test('signing in again from the login screen lifts the lock', function (): void {
    $user = User::factory()->create();
    fromSpa()->actingAs($user)->postJson('/api/user/session-lock')->assertNoContent();

    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertOk();

    fromSpa()->getJson('/api/user')->assertOk();
});

test('the lock belongs to the session, not the account', function (): void {
    $user = User::factory()->create();
    fromSpa()->actingAs($user)->postJson('/api/user/session-lock')->assertNoContent();

    $this->flushSession();

    fromSpa()->actingAs($user)->getJson('/api/user')->assertOk();
});
