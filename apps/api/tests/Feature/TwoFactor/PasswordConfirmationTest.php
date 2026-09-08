<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('confirming the password opens the window for sensitive changes', function (): void {
    $user = User::factory()->create();

    fromSpa()->actingAs($user)
        ->postJson('/api/user/confirm-password', ['password' => 'password'])
        ->assertNoContent();

    fromSpa()->actingAs($user)->postJson('/api/user/two-factor/totp')->assertOk();
});

test('a sensitive route answers 423 until the password is confirmed', function (string $method, string $uri): void {
    $user = User::factory()->create();
    enableTotp($user);

    fromSpa()->actingAs($user)
        ->json($method, $uri)
        ->assertStatus(423)
        ->assertJsonPath('message', __('two-factor.password_confirmation_required'));
})->with([
    'start totp setup' => ['POST', '/api/user/two-factor/totp'],
    'disable totp' => ['DELETE', '/api/user/two-factor/totp'],
    'read recovery codes' => ['GET', '/api/user/two-factor/recovery-codes'],
    'regenerate recovery codes' => ['POST', '/api/user/two-factor/recovery-codes'],
]);

test('a wrong password is rejected and leaves the window closed', function (): void {
    $user = User::factory()->create();

    fromSpa()->actingAs($user)
        ->postJson('/api/user/confirm-password', ['password' => 'not-the-password'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('password');

    fromSpa()->actingAs($user)->postJson('/api/user/two-factor/totp')->assertStatus(423);
});

test('the confirmation window closes after the timeout', function (): void {
    $user = User::factory()->create();

    fromSpa()->actingAs($user)
        ->postJson('/api/user/confirm-password', ['password' => 'password'])
        ->assertNoContent();

    $this->travel(config()->integer('auth.password_timeout'))->seconds();

    fromSpa()->actingAs($user)->postJson('/api/user/two-factor/totp')->assertStatus(423);
});

test('logging in with the password opens the window', function (): void {
    $user = User::factory()->create();

    fromSpa()->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])->assertOk();

    fromSpa()->postJson('/api/user/two-factor/totp')->assertOk();
});

test('registering opens the window', function (): void {
    fromSpa()->postJson('/api/register', [
        'name' => 'Nordlys Studio',
        'email' => 'nordlys@example.com',
        'password' => 'correct-horse-battery',
        'password_confirmation' => 'correct-horse-battery',
    ])->assertCreated();

    fromSpa()->postJson('/api/user/two-factor/totp')->assertOk();
});

test('password confirmation attempts are rate limited', function (): void {
    $user = User::factory()->create();

    foreach (range(1, 6) as $attempt) {
        fromSpa()->actingAs($user)
            ->postJson('/api/user/confirm-password', ['password' => 'not-the-password'])
            ->assertUnprocessable();
    }

    fromSpa()->actingAs($user)
        ->postJson('/api/user/confirm-password', ['password' => 'password'])
        ->assertTooManyRequests();
});

test('guests cannot confirm a password', function (): void {
    fromSpa()->postJson('/api/user/confirm-password', ['password' => 'password'])->assertUnauthorized();
});
