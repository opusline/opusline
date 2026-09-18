<?php

declare(strict_types=1);

use App\Domain\Bank\Actions\StartBankConnection;
use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Enums\BankPsuType;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;

beforeEach(fn () => freezeTodayAtUtcNoon());

function startConnection(User $user, string $aspspName = 'Banque Orvella', int $psuType = 0): TestResponse
{
    return test()->actingAs($user)->postJson('/api/bank/connection', ['aspspName' => $aspspName, 'psuType' => $psuType]);
}

/** The state POST /auth was sent with, as the bank would hand it back. */
function sentState(): string
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

function completeConnection(User $user, string $state, string $code = 'code-from-the-bank'): TestResponse
{
    return test()->actingAs($user)->postJson('/api/bank/connection/complete', ['code' => $code, 'state' => $state]);
}

/** Starts and completes a connection, as the browser round trip would. */
function connectThroughTheBank(User $user): TestResponse
{
    startConnection($user)->assertOk();

    return completeConnection($user, sentState());
}

test('lists the banks of the business country', function (): void {
    fakeEnableBanking();
    $user = withEnableBankingCredentials(User::factory()->create());

    test()->actingAs($user)->getJson('/api/bank/aspsps')
        ->assertOk()
        ->assertJsonPath('aspsps.0.name', 'Banque Orvella')
        ->assertJsonPath('aspsps.0.psuTypes', [BankPsuType::Business->value, BankPsuType::Personal->value])
        ->assertJsonPath('aspsps.0.isBeta', true)
        ->assertJsonPath('aspsps.1.name', 'Caisse Vesterhus');

    Http::assertSent(fn (Request $request): bool => str_contains($request->url(), '/aspsps?')
        && $request['country'] === 'FR' && $request['service'] === 'AIS');
});

test('asks for the application before anything else', function (): void {
    Http::fake();
    $user = User::factory()->create();

    test()->actingAs($user)->getJson('/api/bank/aspsps')->assertConflict()->assertJsonPath('message', __('bank.sync_not_configured'));
    startConnection($user)->assertConflict();

    Http::assertNothingSent();
});

test('opens an authorization at the chosen bank', function (): void {
    fakeEnableBanking();
    $user = withEnableBankingCredentials(User::factory()->create());

    startConnection($user)
        ->assertOk()
        ->assertJsonPath('url', 'https://tilisy.enablebanking.com/welcome?sessionid=73100c65');

    Http::assertSent(function (Request $request): bool {
        if (! str_ends_with($request->url(), '/auth')) {
            return false;
        }

        $jwtHeader = decodeJwt(substr($request->header('Authorization')[0], 7))[0];

        return $request['aspsp'] === ['name' => 'Banque Orvella', 'country' => 'FR']
            && $request['psu_type'] === 'business'
            && $request['redirect_url'] === config('services.enable_banking.redirect_url')
            && preg_match('/^s[0-9a-f]{32}$/', $request['state']) === 1
            && $request['access']['balances'] === true
            && $request['access']['transactions'] === true
            && $jwtHeader['kid'] === ENABLE_BANKING_APPLICATION_ID;
    });
});

test('asks for as long a consent as the bank allows', function (): void {
    fakeEnableBanking();
    $user = withEnableBankingCredentials(User::factory()->create());

    startConnection($user)->assertOk();

    Http::assertSent(fn (Request $request): bool => str_ends_with($request->url(), '/auth')
        && CarbonImmutable::parse($request['access']['valid_until'])->equalTo(CarbonImmutable::now()->addSeconds(15_552_000)->subHour()));
});

test('refuses a bank enable banking does not list', function (): void {
    fakeEnableBanking();

    startConnection(withEnableBankingCredentials(User::factory()->create()), aspspName: 'Banque Fantôme')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('aspspName');
});

test('refuses a login type the bank does not offer', function (): void {
    fakeEnableBanking();

    startConnection(withEnableBankingCredentials(User::factory()->create()), aspspName: 'Caisse Vesterhus', psuType: BankPsuType::Business->value)
        ->assertUnprocessable()
        ->assertJsonValidationErrors('psuType');
});

test('connects the only account of the consent and makes it active', function (): void {
    fakeEnableBanking();
    $user = withEnableBankingCredentials(User::factory()->create());

    connectThroughTheBank($user)
        ->assertOk()
        ->assertJsonPath('connection.aspspName', 'Banque Orvella')
        ->assertJsonPath('connection.status', BankConnectionStatus::Active->value)
        ->assertJsonPath('connection.account.uid', '07cc67f4-45d6-494b-adac-09b5cbc7e2b5')
        ->assertJsonPath('connection.account.name', 'Compte pro')
        ->assertJsonPath('connection.account.ibanLast4', '0185')
        ->assertJsonPath('connection.validUntil', '2027-02-09T12:00:00+00:00')
        ->assertJsonPath('bankSyncConfigured', true);

    $connection = $user->bankConnection()->sole();

    expect($connection->session_id)->toBe('4b1e7c2a-0d7f-4c0e-9a4e-2f1d3c5b6a70')
        ->and(json_encode($connection->accounts))->not->toContain('FR76');
});

test('lets the user pick when the consent covers several accounts', function (): void {
    fakeEnableBanking(['api.enablebanking.com/sessions' => Http::response(ebSession([
        ebAccount(),
        ebAccount(['uid' => 'b2a1c3d4-0000-4000-8000-000000000002', 'identification_hash' => 'hash-savings', 'details' => 'Compte réserve', 'account_id' => ['iban' => 'FR7699999000001234567890999']]),
        ebAccount(['uid' => 'b2a1c3d4-0000-4000-8000-000000000003', 'identification_hash' => 'hash-usd', 'currency' => 'USD']),
    ]))]);
    $user = withEnableBankingCredentials(User::factory()->create());

    connectThroughTheBank($user)
        ->assertOk()
        ->assertJsonPath('connection.status', BankConnectionStatus::AwaitingAccount->value)
        ->assertJsonPath('connection.account', null)
        ->assertJsonCount(2, 'connection.accounts')
        ->assertJsonPath('connection.accounts.1.name', 'Compte réserve');

    test()->actingAs($user)
        ->putJson('/api/bank/connection/account', ['accountUid' => 'b2a1c3d4-0000-4000-8000-000000000002'])
        ->assertOk()
        ->assertJsonPath('connection.status', BankConnectionStatus::Active->value)
        ->assertJsonPath('connection.account.ibanLast4', '0999');
});

test('picking an account does not revive an expired consent', function (): void {
    $user = User::factory()->create();
    $connection = connectedBankFor($user, fn ($factory) => $factory->state(['status' => BankConnectionStatus::Expired]));

    test()->actingAs($user)
        ->putJson('/api/bank/connection/account', ['accountUid' => $connection->account_uid])
        ->assertConflict();

    expect($connection->refresh()->status)->toBe(BankConnectionStatus::Expired);
});

test('refuses to pick an account outside the consent', function (): void {
    $user = User::factory()->create();
    connectedBankFor($user);

    test()->actingAs($user)
        ->putJson('/api/bank/connection/account', ['accountUid' => 'b2a1c3d4-0000-4000-8000-000000000003'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('accountUid');
});

test('refuses a consent with no account in the account currency, and ends it', function (): void {
    fakeEnableBanking(['api.enablebanking.com/sessions' => Http::response(ebSession([ebAccount(['currency' => 'GBP'])]))]);
    $user = withEnableBankingCredentials(User::factory()->create());

    connectThroughTheBank($user)->assertConflict()->assertJsonPath('message', __('bank.sync_currency_mismatch'));

    expect($user->bankConnection()->exists())->toBeFalse();
    Http::assertSent(fn (Request $request): bool => $request->method() === 'DELETE' && str_contains($request->url(), '/sessions/'));
});

test('only the account that opened an authorization can complete it, once', function (): void {
    fakeEnableBanking();
    $owner = withEnableBankingCredentials(User::factory()->create());
    $intruder = withEnableBankingCredentials(User::factory()->create());

    startConnection($owner)->assertOk();
    $state = sentState();

    completeConnection($intruder, $state)->assertUnprocessable()->assertJsonValidationErrors('state');
    completeConnection($owner, $state)->assertUnprocessable()->assertJsonValidationErrors('state');

    expect($intruder->bankConnection()->exists())->toBeFalse()
        ->and($owner->bankConnection()->exists())->toBeFalse();
});

test('an authorization expires with its state', function (): void {
    fakeEnableBanking();
    $user = withEnableBankingCredentials(User::factory()->create());

    startConnection($user)->assertOk();
    $state = sentState();
    test()->travel(StartBankConnection::STATE_TTL_MINUTES + 1)->minutes();

    completeConnection($user, $state)->assertUnprocessable()->assertJsonValidationErrors('state');
});

test('asks to start again when the bank refuses the code', function (): void {
    fakeEnableBanking(['api.enablebanking.com/sessions' => Http::response(['message' => 'Expired', 'error' => 'EXPIRED_AUTHORIZATION_CODE'], 422)]);
    $user = withEnableBankingCredentials(User::factory()->create());

    connectThroughTheBank($user)->assertUnprocessable()->assertJsonValidationErrors('code');
});

test('a reconnection to the same account keeps the sync where it was', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $statement = bankStatementOwnedBy($user);
    $connection = connectedBankFor($user, fn ($factory) => $factory->state([
        'status' => BankConnectionStatus::Expired,
        'session_id' => 'old-session',
        'account_identification_hash' => 'WwpbCiJhY2NvdW50Il0K.orvella-pro',
        'bank_statement_id' => $statement->id,
    ]));

    connectThroughTheBank($user)->assertOk()->assertJsonPath('connection.status', BankConnectionStatus::Active->value);

    $connection->refresh();
    expect($connection->bank_statement_id)->toBe($statement->id)
        ->and($connection->account_uid)->toBe('07cc67f4-45d6-494b-adac-09b5cbc7e2b5');
    Http::assertSent(fn (Request $request): bool => $request->method() === 'DELETE' && str_ends_with($request->url(), '/sessions/old-session'));
});

test('a reconnection to another account starts a statement of its own', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $connection = connectedBankFor($user, fn ($factory) => $factory->state([
        'account_identification_hash' => 'hash-of-another-account',
        'bank_statement_id' => bankStatementOwnedBy($user)->id,
    ]));

    connectThroughTheBank($user)->assertOk();

    expect($connection->refresh()->bank_statement_id)->toBeNull();
});

test('disconnecting ends the consent and keeps the movements', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $connection = connectedBankFor($user);
    bankMovementFor($user);

    test()->actingAs($user)->deleteJson('/api/bank/connection')
        ->assertOk()
        ->assertJsonPath('connection', null)
        ->assertJsonPath('bankSyncConfigured', true);

    expect($user->bankMovements()->count())->toBe(1);
    Http::assertSent(fn (Request $request): bool => $request->method() === 'DELETE'
        && str_ends_with($request->url(), '/sessions/'.$connection->session_id));
});

test('the account summary shows the connection without its session', function (): void {
    $user = User::factory()->create();
    $connection = connectedBankFor($user);

    $response = test()->actingAs($user)->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('connection.aspspName', 'Banque Orvella')
        ->assertJsonPath('connection.status', BankConnectionStatus::Active->value);

    expect($response->getContent())->not->toContain($connection->session_id);
});

test('a consent past its end shows as expired before any sync runs into it', function (): void {
    $user = User::factory()->create();
    connectedBankFor($user, fn ($factory) => $factory->state(['valid_until' => CarbonImmutable::now()->subMinute()]));

    test()->actingAs($user)->getJson('/api/bank')->assertJsonPath('connection.status', BankConnectionStatus::Expired->value);
});

test('the state of an authorization in flight lives in the cache only', function (): void {
    fakeEnableBanking();
    $user = withEnableBankingCredentials(User::factory()->create());

    startConnection($user)->assertOk();

    expect(Cache::get(StartBankConnection::stateKey(sentState())))->toMatchArray(['userId' => $user->id, 'aspspName' => 'Banque Orvella'])
        ->and($user->bankConnection()->exists())->toBeFalse();
});
