<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('a user can log in with valid credentials', function (): void {
    $user = User::factory()->create();

    $response = fromSpa()->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertOk()->assertJsonPath('email', $user->email);
    $this->assertAuthenticated();
});

test('login is rejected with a wrong password', function (): void {
    $user = User::factory()->create();

    fromSpa()->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('email');

    $this->assertGuest();
});

test('login attempts are rate limited', function (): void {
    $user = User::factory()->create();

    foreach (range(1, 6) as $attempt) {
        fromSpa()->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);
    }

    fromSpa()->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertTooManyRequests();
});
