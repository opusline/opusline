<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\Locale;
use App\Domain\Users\Models\User;

test('a user can register', function (): void {
    $response = fromSpa()->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'secret-password',
        'password_confirmation' => 'secret-password',
    ]);

    $response->assertCreated()
        ->assertJsonPath('email', 'test@example.com')
        ->assertJsonMissingPath('password');

    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
});

test('registration fails with an invalid payload', function (): void {
    fromSpa()->postJson('/api/register', [
        'name' => '',
        'email' => 'not-an-email',
        'password' => 'short',
        'password_confirmation' => 'different',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email', 'password']);

    $this->assertGuest();
});

test('a new account starts in the browser language', function (): void {
    fromSpa()->withHeader('Accept-Language', 'fr-FR,fr;q=0.9')->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'secret-password',
        'password_confirmation' => 'secret-password',
    ])->assertCreated();

    expect(User::sole()->settingsOrFail()->locale)->toBe(Locale::fr_FR);
});

test('a new account defaults to English when the browser language is unknown', function (): void {
    fromSpa()->withHeader('Accept-Language', 'de-DE,de;q=0.9')->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'secret-password',
        'password_confirmation' => 'secret-password',
    ])->assertCreated();

    expect(User::sole()->settingsOrFail()->locale)->toBe(Locale::en_US);
});

test('registration fails when the email is already taken', function (): void {
    $existingUser = User::factory()->create();

    fromSpa()->postJson('/api/register', [
        'name' => 'Test User',
        'email' => $existingUser->email,
        'password' => 'secret-password',
        'password_confirmation' => 'secret-password',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

test('registration returns 404 when disabled and an account already exists', function (): void {
    config()->set('auth.registration_enabled', false);
    User::factory()->create();

    fromSpa()->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'secret-password',
        'password_confirmation' => 'secret-password',
    ])->assertNotFound();

    $this->assertGuest();
    $this->assertDatabaseMissing('users', ['email' => 'test@example.com']);
});

test('a disabled register endpoint 404s before validating the payload', function (): void {
    config()->set('auth.registration_enabled', false);
    User::factory()->create();

    fromSpa()->postJson('/api/register', ['email' => 'not-an-email'])->assertNotFound();
});

test('the first account can be created even when registration is disabled', function (): void {
    config()->set('auth.registration_enabled', false);

    fromSpa()->postJson('/api/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'secret-password',
        'password_confirmation' => 'secret-password',
    ])->assertCreated();

    $this->assertAuthenticated();
});
