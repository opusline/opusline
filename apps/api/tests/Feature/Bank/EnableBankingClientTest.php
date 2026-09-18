<?php

declare(strict_types=1);

use App\Domain\Bank\EnableBanking\Aspsp;
use App\Domain\Bank\EnableBanking\BankSyncFailed;
use App\Domain\Bank\EnableBanking\EnableBankingClient;
use App\Domain\Bank\EnableBanking\EnableBankingCredentials;
use App\Domain\Bank\Enums\BankPsuType;
use App\Domain\Bank\Enums\BankSyncError;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

function enableBankingClient(): EnableBankingClient
{
    return app(EnableBankingClient::class);
}

function enableBankingCredentials(): EnableBankingCredentials
{
    return new EnableBankingCredentials(ENABLE_BANKING_APPLICATION_ID, enableBankingPrivateKey());
}

function fetchTransactions(): array
{
    return enableBankingClient()->transactions(
        enableBankingCredentials(),
        'account-uid',
        CarbonImmutable::parse('2026-08-01'),
        CarbonImmutable::parse('2026-08-13'),
        psu: null,
    );
}

function expectUnavailable(callable $call): void
{
    expect($call)->toThrow(function (BankSyncFailed $failure): void {
        expect($failure->reason)->toBe(BankSyncError::Unavailable);
    });
}

test('gives up on a bank that never stops paginating', function (): void {
    Http::fake([
        'api.enablebanking.com/accounts/*/transactions*' => fn () => Http::response([
            'transactions' => [],
            'continuation_key' => bin2hex(random_bytes(8)),
        ]),
    ]);

    expectUnavailable(fetchTransactions(...));
});

test('stops at a continuation key it has already followed', function (): void {
    Http::fake([
        'api.enablebanking.com/accounts/*/transactions*' => Http::sequence()
            ->push(['transactions' => [ebTransaction(['entry_reference' => 'E-1'])], 'continuation_key' => 'again'])
            ->push(['transactions' => [ebTransaction(['entry_reference' => 'E-2'])], 'continuation_key' => 'again']),
    ]);

    expect(fetchTransactions())->toHaveCount(2);
    Http::assertSentCount(2);
});

test('refuses a transactions answer without its list', function (): void {
    Http::fake(['api.enablebanking.com/accounts/*/transactions*' => Http::response(['continuation_key' => null])]);

    expectUnavailable(fetchTransactions(...));
});

test('refuses an answer that is not a json object', function (): void {
    Http::fake(['api.enablebanking.com/accounts/*/transactions*' => Http::response('<html>maintenance</html>')]);

    expectUnavailable(fetchTransactions(...));
});

test('reports an unreachable enable banking as unavailable', function (): void {
    Http::fake(fn () => throw new ConnectionException('Connection timed out'));

    expectUnavailable(fetchTransactions(...));
});

test('refuses an authorization url that does not lead to a secure page', function (?string $url): void {
    Http::fake(['api.enablebanking.com/auth' => Http::response(['url' => $url])]);

    expectUnavailable(fn (): string => enableBankingClient()->startAuthorization(
        enableBankingCredentials(),
        new Aspsp('Banque Orvella', 'FR', [BankPsuType::Business], 15_552_000, isBeta: false),
        BankPsuType::Business,
        's'.str_repeat('0', 32),
        'https://opusline.example/bank-account',
        CarbonImmutable::parse('2027-02-09 12:00:00'),
    ));
})->with(['missing' => [null], 'plain http' => ['http://tilisy.enablebanking.com/welcome']]);

test('refuses a session answer without its id or its end', function (array $session): void {
    Http::fake(['api.enablebanking.com/sessions' => Http::response($session)]);

    expectUnavailable(fn (): mixed => enableBankingClient()->createSession(enableBankingCredentials(), 'code'));
})->with([
    'no session id' => [array_diff_key(ebSession(), ['session_id' => true])],
    'no consent end' => [[...ebSession(), 'access' => []]],
    'unreadable consent end' => [[...ebSession(), 'access' => ['valid_until' => 'someday']]],
]);

test('keeps only the accounts it can identify', function (): void {
    Http::fake(['api.enablebanking.com/sessions' => Http::response(ebSession([
        ebAccount(),
        ebAccount(['uid' => null]),
        ebAccount(['identification_hash' => '']),
    ]))]);

    expect(enableBankingClient()->createSession(enableBankingCredentials(), 'code')->accounts)->toHaveCount(1);
});
