<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Users\Models\User;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;

/**
 * @param  array<string, mixed>  $overrides
 */
function saveEnableBanking(User $user, array $overrides = []): TestResponse
{
    return test()->actingAs($user)->putJson('/api/settings/integrations/enable-banking', [
        'applicationId' => ENABLE_BANKING_APPLICATION_ID,
        'privateKey' => enableBankingPrivateKey(),
        ...$overrides,
    ]);
}

test('saves the application once enable banking vouches for it', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();

    saveEnableBanking($user)
        ->assertOk()
        ->assertJsonPath('enableBanking.applicationId', ENABLE_BANKING_APPLICATION_ID)
        ->assertJsonPath('enableBanking.redirectUrl', config('services.enable_banking.redirect_url'));

    expect($user->settings()->sole()->enable_banking_private_key)->toBe(trim(enableBankingPrivateKey()));
    Http::assertSent(fn (Request $request): bool => $request->url() === 'https://api.enablebanking.com/application'
        && str_starts_with($request->header('Authorization')[0], 'Bearer '));
});

test('stores the private key encrypted', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();

    saveEnableBanking($user)->assertOk();

    $stored = DB::table('user_settings')->where('user_id', $user->id)->value('enable_banking_private_key');

    expect($stored)->not->toContain('PRIVATE KEY')
        ->and(decrypt($stored, unserialize: false))->toBe(trim(enableBankingPrivateKey()));
});

test('never serialises the private key', function (string $endpoint): void {
    $user = withEnableBankingCredentials(User::factory()->create());

    $body = test()->actingAs($user)->getJson($endpoint)->assertOk()->getContent();

    expect($body)->not->toContain('PRIVATE KEY');
})->with(['/api/settings/integrations', '/api/settings', '/api/bank', '/api/user']);

test('shows an unconfigured application with the redirect url to whitelist', function (): void {
    test()->actingAs(User::factory()->create())
        ->getJson('/api/settings/integrations')
        ->assertOk()
        ->assertJsonPath('enableBanking.applicationId', null)
        ->assertJsonPath('enableBanking.redirectUrl', config('services.enable_banking.redirect_url'));
});

test('rejects a malformed application id or key', function (array $overrides, string $field): void {
    Http::fake();

    saveEnableBanking(User::factory()->create(), $overrides)->assertUnprocessable()->assertJsonValidationErrors($field);

    Http::assertNothingSent();
})->with([
    'not a uuid' => [['applicationId' => 'orvella-app'], 'applicationId'],
    'not a key' => [['privateKey' => 'not a key'], 'privateKey'],
    'a public key' => [['privateKey' => openssl_pkey_get_details(openssl_pkey_new(['private_key_bits' => 2048]))['key']], 'privateKey'],
    'a short rsa key' => [['privateKey' => (function (): string {
        openssl_pkey_export(openssl_pkey_new(['private_key_bits' => 1024, 'private_key_type' => OPENSSL_KEYTYPE_RSA]), $pem);

        return $pem;
    })()], 'privateKey'],
    'an ec key' => [['privateKey' => (function (): string {
        openssl_pkey_export(openssl_pkey_new(['private_key_type' => OPENSSL_KEYTYPE_EC, 'curve_name' => 'prime256v1']), $pem);

        return $pem;
    })()], 'privateKey'],
]);

test('names the redirect url the application is missing', function (): void {
    fakeEnableBanking(['api.enablebanking.com/application' => Http::response([
        'redirect_urls' => ['https://elsewhere.example/callback'],
        'active' => true,
    ])]);

    saveEnableBanking(User::factory()->create())
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['applicationId' => config('services.enable_banking.redirect_url')]);
});

test('asks to link an account before an inactive application is saved', function (): void {
    fakeEnableBanking(['api.enablebanking.com/application' => Http::response([
        'redirect_urls' => [config('services.enable_banking.redirect_url')],
        'active' => false,
    ])]);
    $user = User::factory()->create();

    saveEnableBanking($user)->assertUnprocessable()->assertJsonValidationErrors('applicationId');

    expect($user->settings()->sole()->hasEnableBankingCredentials())->toBeFalse();
});

test('reports a key enable banking refuses on the key field', function (): void {
    fakeEnableBanking(['api.enablebanking.com/application' => Http::response(['message' => 'Invalid JWT', 'code' => 401], 401)]);

    saveEnableBanking(User::factory()->create())->assertUnprocessable()->assertJsonValidationErrors('privateKey');
});

test('answers 503 when enable banking cannot be reached', function (): void {
    fakeEnableBanking(['api.enablebanking.com/application' => Http::response(['message' => 'Down'], 502)]);
    $user = User::factory()->create();

    saveEnableBanking($user)->assertServiceUnavailable()->assertJsonPath('message', __('bank.sync_unavailable'));

    expect($user->settings()->sole()->hasEnableBankingCredentials())->toBeFalse();
});

test('expires the connection when another application replaces it', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $connection = connectedBankFor($user);

    saveEnableBanking($user, ['applicationId' => '0b8f3c2e-1a4d-4e6f-9b7c-5d2e1f0a3b4c'])->assertOk();

    expect($connection->refresh()->status)->toBe(BankConnectionStatus::Expired);
    Http::assertSent(fn (Request $request): bool => $request->method() === 'DELETE'
        && $request->url() === 'https://api.enablebanking.com/sessions/'.$connection->session_id);
});

test('keeps the connection when the same application is saved again', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $connection = connectedBankFor($user);

    saveEnableBanking($user)->assertOk();

    expect($connection->refresh()->status)->toBe(BankConnectionStatus::Active);
});

test('removing the application drops the connection but keeps the movements', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $connection = connectedBankFor($user);
    bankMovementFor($user);

    test()->actingAs($user)
        ->deleteJson('/api/settings/integrations/enable-banking')
        ->assertOk()
        ->assertJsonPath('enableBanking.applicationId', null);

    expect($user->bankConnection()->exists())->toBeFalse()
        ->and($user->bankMovements()->count())->toBe(1)
        ->and($user->settings()->sole()->hasEnableBankingCredentials())->toBeFalse();
    Http::assertSent(fn (Request $request): bool => $request->method() === 'DELETE'
        && str_ends_with($request->url(), '/sessions/'.$connection->session_id));
});

test('removing the application still succeeds when the session cannot be revoked', function (): void {
    fakeEnableBanking(['api.enablebanking.com/sessions/*' => Http::response(['message' => 'Down'], 502)]);
    $user = User::factory()->create();
    connectedBankFor($user);

    test()->actingAs($user)->deleteJson('/api/settings/integrations/enable-banking')->assertOk();

    expect($user->bankConnection()->exists())->toBeFalse();
});
