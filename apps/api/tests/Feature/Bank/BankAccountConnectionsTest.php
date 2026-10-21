<?php

declare(strict_types=1);

use App\Domain\Bank\Actions\StartBankConnection;
use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Models\BankConnection;
use App\Domain\Users\Models\User;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * Opens an authorization at Banque Orvella and completes it with the code the
 * bank sends back, as the browser round trip would.
 */
function authorizeBank(User $user, ?BankConnection $renewing = null): TestResponse
{
    test()->actingAs($user)
        ->postJson('/api/bank/connections', array_filter(
            ['aspspName' => 'Banque Orvella', 'psuType' => 0, 'connectionId' => $renewing?->id],
            static fn (mixed $value): bool => $value !== null,
        ))
        ->assertOk();

    return test()->actingAs($user)->postJson('/api/bank/connections/complete', [
        'code' => 'code-from-the-bank',
        'state' => authorizationState(),
    ]);
}

/** The state the latest POST /auth was sent with. */
function authorizationState(): string
{
    $state = null;

    Http::assertSent(function (Request $request) use (&$state): bool {
        if (! str_ends_with($request->url(), '/auth')) {
            return false;
        }

        $state = $request['state'];

        return true;
    });

    return (string) $state;
}

test('connects a second bank next to the first one, into a bank account of its own', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $existing = connectedBankFor($user);

    $response = authorizeBank($user)
        ->assertOk()
        ->assertJsonCount(2, 'account.connections')
        ->assertJsonCount(2, 'account.accounts')
        ->assertJsonPath('account.accounts.1.name', 'Banque Orvella')
        ->assertJsonPath('account.connections.1.status', BankConnectionStatus::Active->value);

    $added = $user->bankConnections()->whereKeyNot($existing->id)->sole();

    expect($response->json('connectionId'))->toBe($added->id)
        ->and($response->json('account.connections.1.bankAccountId'))->toBe($added->bank_account_id)
        ->and($response->json('account.accounts.1.id'))->toBe($added->bank_account_id)
        ->and($added->bank_account_id)->not->toBe($existing->bank_account_id)
        ->and($existing->refresh()->session_id)->not->toBe($added->session_id);
});

test('a first connection feeds the bank account the imported files already fill', function (): void {
    fakeEnableBanking();
    $user = withEnableBankingCredentials(User::factory()->create());
    $statement = bankStatementOwnedBy($user);

    authorizeBank($user)->assertOk()->assertJsonCount(1, 'account.accounts');

    expect($user->bankConnections()->sole()->bank_account_id)->toBe($statement->bank_account_id);
});

test('renews the connection it was started for', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $existing = connectedBankFor($user, fn ($factory) => $factory->state([
        'status' => BankConnectionStatus::Expired,
        'session_id' => 'old-session',
        'account_identification_hash' => 'WwpbCiJhY2NvdW50Il0K.orvella-pro',
    ]));

    authorizeBank($user, renewing: $existing)
        ->assertOk()
        ->assertJsonPath('connectionId', $existing->id)
        ->assertJsonCount(1, 'account.connections');

    expect($existing->refresh()->status)->toBe(BankConnectionStatus::Active)
        ->and($user->bankAccounts()->count())->toBe(1);
});

test('refuses to renew a connection the user does not have', function (): void {
    fakeEnableBanking();
    $user = withEnableBankingCredentials(User::factory()->create());
    $foreign = connectedBankFor(User::factory()->create());

    $this->actingAs($user)
        ->postJson('/api/bank/connections', ['aspspName' => 'Banque Orvella', 'psuType' => 0, 'connectionId' => $foreign->id])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('connectionId');
});

test('without several bank accounts, connecting again renews the one connection', function (): void {
    bankAccountsReleasedAs('off');
    fakeEnableBanking();
    $user = User::factory()->create();
    $existing = connectedBankFor($user, fn ($factory) => $factory->state(['session_id' => 'old-session']));

    $this->actingAs($user)
        ->postJson('/api/bank/connections', ['aspspName' => 'Banque Orvella', 'psuType' => 0])
        ->assertOk();

    expect(Cache::get(StartBankConnection::stateKey(authorizationState())))->toMatchArray(['connectionId' => $existing->id]);
});

test('without several bank accounts, another account at the bank still feeds the one bank account', function (): void {
    bankAccountsReleasedAs('off');
    fakeEnableBanking();
    $user = User::factory()->create();
    $existing = connectedBankFor($user, fn ($factory) => $factory->state(['session_id' => 'old-session']));

    authorizeBank($user)
        ->assertOk()
        ->assertJsonPath('connectionId', $existing->id)
        ->assertJsonCount(1, 'account.connections')
        ->assertJsonCount(1, 'account.accounts');

    expect($user->bankConnections()->sole()->bank_account_id)->toBe($existing->bank_account_id);
    Http::assertSent(fn (Request $request): bool => $request->method() === 'DELETE' && str_ends_with($request->url(), '/sessions/old-session'));
});

test('refuses a consent whose account another connection already syncs, and ends it', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $existing = connectedBankFor($user, fn ($factory) => $factory->state([
        'account_identification_hash' => 'WwpbCiJhY2NvdW50Il0K.orvella-pro',
    ]));

    authorizeBank($user)
        ->assertUnprocessable()
        ->assertJsonValidationErrors('accountUid');

    expect($user->bankConnections()->sole()->id)->toBe($existing->id)
        ->and($user->bankAccounts()->count())->toBe(1);
    Http::assertSent(fn (Request $request): bool => $request->method() === 'DELETE'
        && str_ends_with($request->url(), '/sessions/4b1e7c2a-0d7f-4c0e-9a4e-2f1d3c5b6a70'));
    Http::assertNotSent(fn (Request $request): bool => $request->method() === 'DELETE'
        && str_ends_with($request->url(), '/sessions/'.$existing->session_id));
});

test('syncing one connection reads and records its own bank account only', function (): void {
    fakeEnableBanking([
        'api.enablebanking.com/accounts/*/transactions*' => Http::response(['transactions' => [ebTransaction()], 'continuation_key' => null]),
    ]);
    $user = User::factory()->create();
    $synced = connectedBankFor($user);
    $other = connectedBankFor($user, fn ($factory) => $factory->state(['aspsp_name' => 'Caisse Vesterhus']));

    $this->actingAs($user)
        ->postJson("/api/bank/connections/{$synced->id}/sync")
        ->assertOk()
        ->assertJsonPath('importedCount', 1);

    expect($synced->account->movements()->count())->toBe(1)
        ->and($other->account->movements()->count())->toBe(0)
        ->and($other->refresh()->last_synced_at)->toBeNull();
    Http::assertSent(fn (Request $request): bool => str_contains($request->url(), "/accounts/{$synced->account_uid}/transactions"));
    Http::assertNotSent(fn (Request $request): bool => str_contains($request->url(), "/accounts/{$other->account_uid}/"));
});

test('disconnecting one bank leaves the others connected', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $kept = connectedBankFor($user);
    $dropped = connectedBankFor($user);

    $this->actingAs($user)
        ->deleteJson("/api/bank/connections/{$dropped->id}")
        ->assertOk()
        ->assertJsonCount(1, 'connections')
        ->assertJsonPath('connections.0.id', $kept->id)
        // The bank account and its history stay.
        ->assertJsonCount(2, 'accounts');
});

test('another user\'s connection is invisible and untouched', function (string $method, string $suffix): void {
    Http::fake();
    $user = withEnableBankingCredentials(User::factory()->create());
    $foreign = connectedBankFor(User::factory()->create());

    $this->actingAs($user)
        ->json($method, "/api/bank/connections/{$foreign->id}{$suffix}", ['accountUid' => $foreign->account_uid])
        ->assertNotFound();

    expect($foreign->refresh()->last_synced_at)->toBeNull();
    Http::assertNothingSent();
})->with([
    'sync' => ['POST', '/sync'],
    'pick an account' => ['PUT', '/account'],
    'disconnect' => ['DELETE', ''],
]);
