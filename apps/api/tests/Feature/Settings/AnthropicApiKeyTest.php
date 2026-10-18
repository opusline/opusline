<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

beforeEach(function (): void {
    config()->set('services.anthropic.model', 'claude-opus-5-5');
});

function fakeAnthropicModels(int $status = 200): void
{
    Http::fake(['api.anthropic.com/v1/models/*' => $status === 200
        ? Http::response(['id' => 'claude-opus-5-5', 'type' => 'model', 'display_name' => 'Claude Opus 5.5', 'created_at' => '2026-01-01T00:00:00Z'])
        : Http::response(['type' => 'error', 'error' => ['type' => 'error', 'message' => 'refused']], $status)]);
}

test('saves the key once anthropic accepts it for the instance model', function (): void {
    fakeAnthropicModels();
    $user = User::factory()->create();

    $this->actingAs($user)->putJson('/api/settings/integrations/anthropic', ['apiKey' => ANTHROPIC_TEST_KEY])
        ->assertOk()
        ->assertJsonPath('anthropic.hasApiKey', true)
        ->assertJsonPath('anthropic.model', 'claude-opus-5-5');

    expect($user->settings()->sole()->anthropic_api_key)->toBe(ANTHROPIC_TEST_KEY);
    Http::assertSent(fn (Request $request): bool => $request->url() === 'https://api.anthropic.com/v1/models/claude-opus-5-5'
        && $request->hasHeader('x-api-key', ANTHROPIC_TEST_KEY));
});

test('stores the key encrypted', function (): void {
    fakeAnthropicModels();
    $user = User::factory()->create();

    $this->actingAs($user)->putJson('/api/settings/integrations/anthropic', ['apiKey' => ANTHROPIC_TEST_KEY])->assertOk();

    $stored = DB::table('user_settings')->where('user_id', $user->id)->value('anthropic_api_key');

    expect($stored)->not->toContain('sk-ant-')
        ->and(decrypt($stored, unserialize: false))->toBe(ANTHROPIC_TEST_KEY);
});

test('never serialises the key', function (string $endpoint): void {
    $user = withAnthropicApiKey(User::factory()->create());

    $body = $this->actingAs($user)->getJson($endpoint)->assertOk()->getContent();

    expect($body)->not->toContain(ANTHROPIC_TEST_KEY);
})->with(['/api/settings/integrations', '/api/settings', '/api/user']);

test('refuses a key anthropic does not accept', function (int $status, string $message): void {
    fakeAnthropicModels($status);
    $user = User::factory()->create();

    $this->actingAs($user)->putJson('/api/settings/integrations/anthropic', ['apiKey' => ANTHROPIC_TEST_KEY])
        ->assertUnprocessable()
        ->assertJsonPath('errors.apiKey.0', __($message, ['model' => 'claude-opus-5-5']));

    expect($user->settings()->sole()->anthropic_api_key)->toBeNull();
})->with([
    'revoked key' => [401, 'settings.anthropic_key_rejected'],
    'key without access' => [403, 'settings.anthropic_key_rejected'],
    'model not enabled' => [404, 'settings.anthropic_model_unavailable'],
]);

test('says when anthropic cannot be reached to check the key', function (): void {
    Http::fake(['api.anthropic.com/*' => Http::failedConnection()]);
    $user = User::factory()->create();

    $this->actingAs($user)->putJson('/api/settings/integrations/anthropic', ['apiKey' => ANTHROPIC_TEST_KEY])
        ->assertServiceUnavailable()
        ->assertJsonPath('message', __('settings.anthropic_unreachable'));

    expect($user->settings()->sole()->anthropic_api_key)->toBeNull();
});

test('refuses something that is not an anthropic key without asking anthropic', function (string $apiKey): void {
    Http::fake();

    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings/integrations/anthropic', ['apiKey' => $apiKey])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('apiKey');

    Http::assertNothingSent();
})->with(['sk-proj-openai', '', str_repeat('sk-ant-', 40)]);

test('forgets the key', function (): void {
    $user = withAnthropicApiKey(User::factory()->create());

    $this->actingAs($user)->deleteJson('/api/settings/integrations/anthropic')
        ->assertOk()
        ->assertJsonPath('anthropic.hasApiKey', false);

    expect($user->settings()->sole()->anthropic_api_key)->toBeNull();
});

test('keeps one account\'s key its own', function (): void {
    $owner = withAnthropicApiKey(User::factory()->create());

    $this->actingAs(User::factory()->create())->deleteJson('/api/settings/integrations/anthropic')->assertOk();

    expect($owner->settings()->sole()->anthropic_api_key)->toBe(ANTHROPIC_TEST_KEY);
});
