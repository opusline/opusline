<?php

declare(strict_types=1);

use App\Domain\Users\Enums\Theme;
use App\Domain\Users\Models\User;
use App\Http\Users\Support\ThemeCookie;

test('defaults a new account to the system theme', function (): void {
    $user = User::factory()->create();

    expect($user->theme)->toBe(Theme::System);
});

test('persists the chosen theme', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/user/theme', ['theme' => Theme::Light->value])
        ->assertOk()
        ->assertJsonPath('theme', Theme::Light->value);

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'theme' => Theme::Light->value,
    ]);
});

test('mirrors the theme into a cookie the browser can read', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->putJson('/api/user/theme', ['theme' => Theme::Dark->value])
        ->assertOk()
        ->assertCookie(ThemeCookie::NAME, 'dark', encrypted: false);

    expect($response->getCookie(ThemeCookie::NAME, false)?->isHttpOnly())->toBeFalse();
});

test('sends the theme cookie on login', function (): void {
    $user = User::factory()->create(['theme' => Theme::Dark]);

    fromSpa()->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ])
        ->assertOk()
        ->assertCookie(ThemeCookie::NAME, 'dark', encrypted: false);
});

test('sends the theme cookie on registration', function (): void {
    fromSpa()->postJson('/api/register', [
        'name' => 'Théo Marchand',
        'email' => 'theo@marchand.dev',
        'password' => 'secret-password',
        'password_confirmation' => 'secret-password',
    ])
        ->assertCreated()
        ->assertCookie(ThemeCookie::NAME, 'system', encrypted: false);
});

test('clears the theme cookie on logout', function (): void {
    $this->actingAs(User::factory()->create(['theme' => Theme::Light]));

    fromSpa()->postJson('/api/logout')
        ->assertNoContent()
        ->assertCookieExpired(ThemeCookie::NAME);
});

test('rejects an unknown theme', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/user/theme', ['theme' => 99])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['theme']);
});

test('returns 401 for guests', function (): void {
    $this->putJson('/api/user/theme', ['theme' => Theme::Dark->value])
        ->assertUnauthorized();
});
