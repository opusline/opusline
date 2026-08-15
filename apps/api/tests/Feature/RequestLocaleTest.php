<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\Locale;
use App\Domain\Users\Models\User;

function loginFailureMessage(string $acceptLanguage): ?string
{
    $response = fromSpa()->withHeader('Accept-Language', $acceptLanguage)->postJson('/api/login', [
        'email' => 'nobody@example.com',
        'password' => 'wrong-password',
    ]);

    return $response->json('errors.email.0');
}

test('answers in the account language whatever the browser says', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['locale' => Locale::fr_FR]);

    $response = $this->actingAs($user)
        ->withHeader('Accept-Language', 'en-US,en;q=0.9')
        ->putJson('/api/settings', settingsPayload(['workdayMinutes' => 0]))
        ->assertUnprocessable();

    expect($response->json('errors.workdayMinutes.0'))->toContain('durée de journée');
});

test('negotiates a French guest from the Accept-Language header', function (): void {
    expect(loginFailureMessage('fr-FR,fr;q=0.9'))->toBe(__('auth.failed', locale: 'fr'));
});

test('picks English for a browser that only offers it second', function (): void {
    expect(loginFailureMessage('de-DE,de;q=0.9,en;q=0.8'))->toBe(__('auth.failed', locale: 'en'));
});

test('falls back to English when the browser offers neither language', function (): void {
    expect(loginFailureMessage('de-DE,de;q=0.9'))->toBe(__('auth.failed', locale: 'en'));
});

test('defaults to English when the browser sends no language', function (): void {
    // An empty header, because Symfony's test requests inject an en-us
    // Accept-Language default — a truly absent header only exists in production.
    expect(loginFailureMessage(''))->toBe(__('auth.failed', locale: 'en'));
});
