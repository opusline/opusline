<?php

declare(strict_types=1);

use App\Domain\AccessTokens\Models\AccessToken;
use App\Domain\Users\Enums\SecurityAlertKind;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\SecurityAlert;
use Illuminate\Support\Facades\Notification;

const TOKEN_PAYLOAD = ['name' => 'Runway', 'abilities' => ['invoices:read']];

test('creates a token and shows its secret this once', function (): void {
    Notification::fake();
    $user = User::factory()->create();

    $response = withConfirmedPassword($user)->postJson('/api/user/tokens', TOKEN_PAYLOAD)
        ->assertCreated()
        ->assertJsonPath('token.name', 'Runway')
        ->assertJsonPath('token.abilities', ['invoices:read'])
        ->assertJsonPath('token.lastUsedAt', null);

    $plainText = $response->json('plainTextToken');
    expect($plainText)->toBeString()->toMatch('/^\d+\|[A-Za-z0-9]{48}$/');

    $token = $user->tokens()->sole();
    expect($token->token)->toBe(hash('sha256', explode('|', $plainText, 2)[1]))
        ->and($token->abilities)->toBe(['invoices:read']);
    Notification::assertSentTo(
        $user,
        SecurityAlert::class,
        fn (SecurityAlert $alert): bool => $alert->kind === SecurityAlertKind::AccessTokenCreated,
    );
});

test('refuses to create a token until the password is confirmed', function (): void {
    $user = User::factory()->create();

    fromSpa()->actingAs($user)->postJson('/api/user/tokens', TOKEN_PAYLOAD)->assertStatus(423);

    expect(AccessToken::query()->count())->toBe(0);
});

test('refuses a token it cannot mint', function (array $payload, string $field): void {
    $user = User::factory()->create();

    withConfirmedPassword($user)->postJson('/api/user/tokens', $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor($field);

    expect(AccessToken::query()->count())->toBe(0);
})->with([
    'no name' => [['name' => '', 'abilities' => ['invoices:read']], 'name'],
    'no abilities' => [['name' => 'Runway', 'abilities' => []], 'abilities'],
    'an ability it does not know' => [['name' => 'Runway', 'abilities' => ['invoices:write']], 'abilities.0'],
    'the same ability twice' => [['name' => 'Runway', 'abilities' => ['invoices:read', 'invoices:read']], 'abilities.1'],
    'a wildcard' => [['name' => 'Runway', 'abilities' => ['*']], 'abilities.0'],
]);

test('lists the account\'s tokens without their secrets', function (): void {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $user->createToken('Runway', ['invoices:read']);
    $other->createToken('Elsewhere', ['invoices:read']);

    fromSpa()->actingAs($user)->getJson('/api/user/tokens')
        ->assertOk()
        ->assertJsonCount(1, 'tokens')
        ->assertJsonPath('tokens.0.name', 'Runway')
        ->assertJsonPath('tokens.0.abilities', ['invoices:read'])
        ->assertJsonMissingPath('tokens.0.token')
        ->assertJsonMissingPath('tokens.0.plainTextToken');
});

test('revokes a token', function (): void {
    Notification::fake();
    $user = User::factory()->create();
    $created = $user->createToken('Runway', ['invoices:read']);

    fromSpa()->actingAs($user)
        ->deleteJson('/api/user/tokens/'.$created->accessToken->getKey())
        ->assertNoContent();

    expect(AccessToken::query()->count())->toBe(0);
    Notification::assertSentTo(
        $user,
        SecurityAlert::class,
        fn (SecurityAlert $alert): bool => $alert->kind === SecurityAlertKind::AccessTokenRevoked,
    );
});

test('does not find another account\'s token', function (): void {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $foreign = $other->createToken('Elsewhere', ['invoices:read']);

    fromSpa()->actingAs($user)
        ->deleteJson('/api/user/tokens/'.$foreign->accessToken->getKey())
        ->assertNotFound();

    expect($other->tokens()->count())->toBe(1);
});

test('a token cannot manage tokens', function (string $method, string $uri): void {
    $user = User::factory()->create();
    $created = $user->createToken('Runway', ['invoices:read']);

    $this->withToken($created->plainTextToken)
        ->json($method, str_replace('{token}', (string) $created->accessToken->getKey(), $uri), TOKEN_PAYLOAD)
        ->assertForbidden()
        ->assertJsonPath('message', __('tokens.not_for_tokens'));

    expect($user->tokens()->count())->toBe(1);
})->with([
    ['GET', '/api/user/tokens'],
    ['POST', '/api/user/tokens'],
    ['DELETE', '/api/user/tokens/{token}'],
]);
