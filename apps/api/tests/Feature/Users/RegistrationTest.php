<?php

declare(strict_types=1);

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
