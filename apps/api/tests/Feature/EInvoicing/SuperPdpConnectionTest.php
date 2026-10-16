<?php

declare(strict_types=1);

use App\Domain\EInvoicing\Enums\PlatformEnvironment;
use App\Domain\Users\Models\User;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;

/**
 * @param  array<string, mixed>  $overrides
 */
function connectSuperPdp(User $user, array $overrides = []): TestResponse
{
    return test()->actingAs($user)->putJson('/api/settings/integrations/super-pdp', [
        'clientId' => SUPER_PDP_CLIENT_ID,
        'clientSecret' => SUPER_PDP_CLIENT_SECRET,
        ...$overrides,
    ]);
}

test('saves the application with what super pdp says about the company', function (): void {
    fakeSuperPdp();
    $user = User::factory()->create();

    connectSuperPdp($user)
        ->assertOk()
        ->assertJsonPath('eInvoicing.clientId', SUPER_PDP_CLIENT_ID)
        ->assertJsonPath('eInvoicing.companyName', 'Théo Marchand')
        ->assertJsonPath('eInvoicing.companyNumber', '123456782')
        ->assertJsonPath('eInvoicing.environment', PlatformEnvironment::Sandbox->value)
        ->assertJsonPath('eInvoicing.companyVerified', true)
        ->assertJsonPath('eInvoicing.receivingAddress', '0225:12345678200002');

    expect($user->eInvoicingConnection()->sole()->client_secret)->toBe(SUPER_PDP_CLIENT_SECRET);
    Http::assertSent(fn (Request $request): bool => $request->url() === 'https://api.superpdp.tech/oauth2/token'
        && $request['grant_type'] === 'client_credentials'
        && $request['client_id'] === SUPER_PDP_CLIENT_ID);
    Http::assertSent(fn (Request $request): bool => str_contains($request->url(), '/french_directory/entries')
        && $request['number'] === '123456782'
        && $request->header('Authorization')[0] === 'Bearer tok_sandbox');
});

test('stores the client secret encrypted and never serialises it', function (): void {
    fakeSuperPdp();
    $user = User::factory()->create();

    connectSuperPdp($user)->assertOk();

    $stored = DB::table('e_invoicing_connections')->where('user_id', $user->id)->value('client_secret');
    expect($stored)->not->toContain(SUPER_PDP_CLIENT_SECRET)
        ->and(decrypt($stored, unserialize: false))->toBe(SUPER_PDP_CLIENT_SECRET);

    foreach (['/api/settings/integrations', '/api/user'] as $endpoint) {
        expect(test()->actingAs($user)->getJson($endpoint)->assertOk()->getContent())->not->toContain(SUPER_PDP_CLIENT_SECRET);
    }
});

test('shows no platform until one is saved', function (): void {
    test()->actingAs(User::factory()->create())
        ->getJson('/api/settings/integrations')
        ->assertOk()
        ->assertJsonPath('eInvoicing.clientId', null)
        ->assertJsonPath('eInvoicing.companyVerified', false)
        ->assertJsonPath('eInvoicing.receivingAddress', null);
});

test('keeps credentials the platform has not verified yet, saying so', function (): void {
    fakeSuperPdp([
        'api.superpdp.tech/v1.beta/oauth2_sessions/me' => Http::response(['company_verification_status' => 'pending']),
        'api.superpdp.tech/v1.beta/companies/me' => Http::response(['message' => 'Forbidden'], 403),
    ]);
    $user = User::factory()->create();

    connectSuperPdp($user)
        ->assertOk()
        ->assertJsonPath('eInvoicing.clientId', SUPER_PDP_CLIENT_ID)
        ->assertJsonPath('eInvoicing.companyVerified', false)
        ->assertJsonPath('eInvoicing.companyName', null)
        ->assertJsonPath('eInvoicing.receivingAddress', null);
});

test('rejects malformed credentials before asking the platform', function (array $overrides, string $field): void {
    Http::fake();

    connectSuperPdp(User::factory()->create(), $overrides)->assertUnprocessable()->assertJsonValidationErrors($field);

    Http::assertNothingSent();
})->with([
    'short id' => [['clientId' => 'abc'], 'clientId'],
    'short secret' => [['clientSecret' => 'abc'], 'clientSecret'],
]);

test('reports credentials super pdp refuses on the secret field', function (): void {
    fakeSuperPdp(['api.superpdp.tech/oauth2/token' => Http::response(['error' => 'invalid_client'], 401)]);
    $user = User::factory()->create();

    connectSuperPdp($user)->assertUnprocessable()->assertJsonValidationErrors(['clientSecret' => __('einvoicing.credentials_rejected')]);

    expect($user->eInvoicingConnection()->exists())->toBeFalse();
});

test('answers 503 when super pdp cannot be reached', function (): void {
    fakeSuperPdp(['api.superpdp.tech/v1.beta/oauth2_sessions/me' => Http::response(['message' => 'Down'], 502)]);
    $user = User::factory()->create();

    connectSuperPdp($user)->assertServiceUnavailable()->assertJsonPath('message', __('einvoicing.unavailable'));

    expect($user->eInvoicingConnection()->exists())->toBeFalse();
});

test('a check refreshes what the platform says', function (): void {
    fakeSuperPdp();
    $user = User::factory()->create();
    withSuperPdpConnection($user, ['company_verified' => false, 'company_name' => null, 'receiving_address' => null, 'checked_at' => null]);

    test()->actingAs($user)
        ->postJson('/api/settings/integrations/super-pdp/check')
        ->assertOk()
        ->assertJsonPath('eInvoicing.companyVerified', true)
        ->assertJsonPath('eInvoicing.companyName', 'Théo Marchand')
        ->assertJsonPath('eInvoicing.receivingAddress', '0225:12345678200002');

    expect($user->eInvoicingConnection()->sole()->checked_at)->not->toBeNull();
});

test('a check says when the credentials were revoked', function (): void {
    fakeSuperPdp(['api.superpdp.tech/oauth2/token' => Http::response(['error' => 'invalid_client'], 401)]);
    $user = User::factory()->create();
    withSuperPdpConnection($user);

    test()->actingAs($user)
        ->postJson('/api/settings/integrations/super-pdp/check')
        ->assertConflict()
        ->assertJsonPath('message', __('einvoicing.credentials_rejected'));
});

test('a check needs a saved application', function (): void {
    Http::fake();

    test()->actingAs(User::factory()->create())
        ->postJson('/api/settings/integrations/super-pdp/check')
        ->assertConflict()
        ->assertJsonPath('message', __('einvoicing.not_connected'));
});

test('removing the application forgets it', function (): void {
    $user = User::factory()->create();
    withSuperPdpConnection($user);

    test()->actingAs($user)
        ->deleteJson('/api/settings/integrations/super-pdp')
        ->assertOk()
        ->assertJsonPath('eInvoicing.clientId', null);

    expect($user->eInvoicingConnection()->exists())->toBeFalse();
});

test('keeps each account\'s platform to itself', function (): void {
    fakeSuperPdp();
    $owner = User::factory()->create();
    $kept = withSuperPdpConnection($owner, ['client_id' => 'opusline_owner_app']);
    $other = User::factory()->create();

    connectSuperPdp($other)->assertOk();
    test()->actingAs($other)->deleteJson('/api/settings/integrations/super-pdp')->assertOk();

    expect($owner->eInvoicingConnection()->sole()->client_id)->toBe('opusline_owner_app')
        ->and($kept->fresh())->not->toBeNull();
    test()->actingAs($owner)->getJson('/api/settings/integrations')->assertJsonPath('eInvoicing.clientId', 'opusline_owner_app');
});

test('needs a signed-in account', function (): void {
    test()->putJson('/api/settings/integrations/super-pdp', ['clientId' => SUPER_PDP_CLIENT_ID, 'clientSecret' => SUPER_PDP_CLIENT_SECRET])->assertUnauthorized();
    test()->postJson('/api/settings/integrations/super-pdp/check')->assertUnauthorized();
    test()->deleteJson('/api/settings/integrations/super-pdp')->assertUnauthorized();
});
