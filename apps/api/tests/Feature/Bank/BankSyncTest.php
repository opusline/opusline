<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankBalanceSource;
use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Enums\BankMatchReason;
use App\Domain\Bank\Enums\BankStatementFormat;
use App\Domain\Bank\Enums\BankSyncError;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;

beforeEach(fn () => freezeTodayAtUtcNoon());

function syncBank(User $user): TestResponse
{
    // A fresh copy, as each real request loads: the settings memoize today(),
    // which a test travelling in time would otherwise read stale.
    return test()->actingAs($user->fresh())
        ->withHeader('User-Agent', 'Mozilla/5.0 (Opusline test)')
        ->postJson('/api/bank/connection/sync');
}

/**
 * @param  list<array<string, mixed>>  $transactions
 */
function transactionsPage(array $transactions, ?string $continuationKey = null): mixed
{
    return Http::response(['transactions' => $transactions, 'continuation_key' => $continuationKey]);
}

/** The date_from of every transaction fetch sent so far. */
function fetchedFrom(): array
{
    return Http::recorded(fn (Request $request): bool => str_contains($request->url(), '/transactions'))
        ->map(fn (array $pair): string => $pair[0]['date_from'])
        ->values()
        ->all();
}

test('a first sync on an empty account reads ninety days back', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    connectedBankFor($user);

    syncBank($user)->assertOk();

    expect(fetchedFrom())->toBe(['2026-05-15']);
});

test('records the movements on one statement the connection keeps', function (): void {
    fakeEnableBanking([
        'api.enablebanking.com/accounts/*/transactions*' => transactionsPage([
            ebTransaction(['entry_reference' => 'E-1', 'booking_date' => '2026-08-10']),
            ebTransaction(['entry_reference' => 'E-2', 'booking_date' => '2026-08-11', 'credit_debit_indicator' => 'DBIT', 'transaction_amount' => ['currency' => 'EUR', 'amount' => '45.50'], 'creditor' => ['name' => 'LUNAPRINT']]),
        ]),
    ]);
    $user = User::factory()->create();
    $connection = connectedBankFor($user);

    syncBank($user)
        ->assertOk()
        ->assertJsonPath('lineCount', 2)
        ->assertJsonPath('importedCount', 2)
        ->assertJsonPath('account.statements.0.format', BankStatementFormat::EnableBanking->value)
        ->assertJsonPath('account.statements.0.fileName', 'Banque Orvella')
        ->assertJsonPath('account.statements.0.periodStart', '2026-05-15')
        ->assertJsonPath('account.statements.0.periodEnd', '2026-08-13')
        ->assertJsonPath('account.statements.0.lineCount', 2)
        ->assertJsonPath('account.connection.lastError', null);

    expect($user->bankMovements()->orderBy('booked_on')->get()->map(fn (BankMovement $movement): int => (int) $movement->amount_cents->getAmount())->all())
        ->toBe([12_000, -4_550])
        ->and($connection->refresh()->bank_statement_id)->toBe($user->bankStatements()->sole()->id);
});

test('a later sync steps back over the overlap without duplicating what it already read', function (): void {
    $page = [
        ebTransaction(['entry_reference' => 'E-1', 'booking_date' => '2026-08-10']),
        ebTransaction(['entry_reference' => 'E-2', 'booking_date' => '2026-08-12']),
    ];
    fakeEnableBanking(['api.enablebanking.com/accounts/*/transactions*' => transactionsPage($page)]);
    $user = User::factory()->create();
    connectedBankFor($user);

    syncBank($user)->assertOk()->assertJsonPath('importedCount', 2);
    test()->travelTo(CarbonImmutable::parse('2026-08-20 12:00:00', 'UTC'));

    syncBank($user)
        ->assertOk()
        ->assertJsonPath('lineCount', 2)
        ->assertJsonPath('importedCount', 0)
        ->assertJsonPath('account.statements.0.periodEnd', '2026-08-20')
        ->assertJsonPath('account.statements.0.lineCount', 2);

    expect(fetchedFrom())->toBe(['2026-05-15', '2026-08-06'])
        ->and($user->bankStatements()->count())->toBe(1)
        ->and($user->bankMovements()->count())->toBe(2);
});

test('follows the pages of a long answer', function (): void {
    fakeEnableBanking([
        'api.enablebanking.com/accounts/*/transactions*' => Http::sequence()
            ->push(['transactions' => [ebTransaction(['entry_reference' => 'E-1'])], 'continuation_key' => 'page-2'])
            ->push(['transactions' => [ebTransaction(['entry_reference' => 'E-2'])], 'continuation_key' => null]),
    ]);
    $user = User::factory()->create();
    connectedBankFor($user);

    syncBank($user)->assertOk()->assertJsonPath('importedCount', 2);

    Http::assertSent(fn (Request $request): bool => str_contains($request->url(), '/transactions')
        && ($request['continuation_key'] ?? null) === 'page-2');
});

test('tells the bank the account holder is present when they ask', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    connectedBankFor($user);

    syncBank($user)->assertOk();

    Http::assertSent(fn (Request $request): bool => str_contains($request->url(), '/transactions')
        && $request->header('Psu-User-Agent') === ['Mozilla/5.0 (Opusline test)']
        && $request->header('Psu-Ip-Address') === ['127.0.0.1']);
});

test('keeps the reason of a refused sync and writes nothing', function (string $error, int $status, BankSyncError $reason, BankConnectionStatus $connectionStatus): void {
    fakeEnableBanking([
        'api.enablebanking.com/accounts/*/transactions*' => Http::response(['message' => 'Refused', 'code' => $status, 'error' => $error], $status),
    ]);
    $user = User::factory()->create();
    $connection = connectedBankFor($user);

    syncBank($user)->assertStatus($reason->httpStatus())->assertJsonPath('message', __($reason->messageKey()));

    $connection->refresh();
    expect($connection->last_error)->toBe($reason)
        ->and($connection->last_failed_at)->not->toBeNull()
        ->and($connection->status)->toBe($connectionStatus)
        ->and($user->bankStatements()->exists())->toBeFalse();
})->with([
    'rate limited' => ['ASPSP_RATE_LIMIT_EXCEEDED', 429, BankSyncError::RateLimited, BankConnectionStatus::Active],
    'consent expired' => ['EXPIRED_SESSION', 401, BankSyncError::ConsentExpired, BankConnectionStatus::Expired],
    'consent revoked' => ['REVOKED_SESSION', 422, BankSyncError::ConsentExpired, BankConnectionStatus::Expired],
    'bank down' => ['ASPSP_ERROR', 500, BankSyncError::Unavailable, BankConnectionStatus::Active],
]);

test('refuses movements in another currency and writes nothing', function (): void {
    fakeEnableBanking([
        'api.enablebanking.com/accounts/*/transactions*' => transactionsPage([
            ebTransaction(['transaction_amount' => ['currency' => 'CHF', 'amount' => '10.00']]),
        ]),
    ]);
    $user = User::factory()->create();
    connectedBankFor($user);

    syncBank($user)->assertConflict()->assertJsonPath('message', __('bank.sync_currency_mismatch'));

    expect($user->bankMovements()->exists())->toBeFalse();
});

test('does not call the bank on a consent past its end', function (): void {
    Http::fake();
    $user = User::factory()->create();
    $connection = connectedBankFor($user, fn ($factory) => $factory->state(['valid_until' => CarbonImmutable::now()->subDay()]));

    syncBank($user)->assertConflict()->assertJsonPath('message', __('bank.sync_consent_expired'));

    Http::assertNothingSent();
    expect($connection->refresh()->status)->toBe(BankConnectionStatus::Expired);
});

test('needs a connected account to sync', function (?callable $configure): void {
    Http::fake();
    $user = User::factory()->create();

    if ($configure !== null) {
        connectedBankFor($user, $configure);
    } else {
        withEnableBankingCredentials($user);
    }

    syncBank($user)->assertConflict()->assertJsonPath('message', __('bank.sync_not_connected'));
    Http::assertNothingSent();
})->with([
    'no connection' => [null],
    'account not picked yet' => [fn ($factory) => $factory->state(['status' => BankConnectionStatus::AwaitingAccount, 'account_uid' => null])],
]);

test('a synced payment raises the invoice suggestion', function (): void {
    fakeEnableBanking([
        'api.enablebanking.com/accounts/*/transactions*' => transactionsPage([
            ebTransaction([
                'transaction_amount' => ['currency' => 'EUR', 'amount' => '1980.00'],
                'remittance_information' => ['VIR SEPA REF 2026041'],
            ]),
        ]),
    ]);
    $user = User::factory()->create();
    connectedBankFor($user);
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['number' => '2026-041']));

    syncBank($user)
        ->assertOk()
        ->assertJsonPath('suggestionCount', 1)
        ->assertJsonPath('account.pendingMatches.0.reason', BankMatchReason::RefInLabel->value)
        ->assertJsonPath('account.pendingMatches.0.invoice.id', $invoice->id);
});

test('the bank balance anchors an account nobody typed a balance for', function (): void {
    fakeEnableBanking([
        'api.enablebanking.com/accounts/*/balances' => Http::response(['balances' => [
            ['name' => 'Booked', 'balance_type' => 'CLBD', 'balance_amount' => ['currency' => 'EUR', 'amount' => '5230.10'], 'reference_date' => '2026-08-12'],
        ]]),
    ]);
    $user = User::factory()->create();
    connectedBankFor($user);

    syncBank($user)
        ->assertOk()
        ->assertJsonPath('account.balance.amount.amount', 523_010)
        ->assertJsonPath('account.balance.source', BankBalanceSource::Statement->value)
        ->assertJsonPath('account.balance.asOf', '2026-08-12');
});

test('a typed balance stays the anchor over the bank one', function (): void {
    fakeEnableBanking([
        'api.enablebanking.com/accounts/*/balances' => Http::response(['balances' => [
            ['name' => 'Booked', 'balance_type' => 'CLBD', 'balance_amount' => ['currency' => 'EUR', 'amount' => '5230.10'], 'reference_date' => '2026-08-12'],
        ]]),
    ]);
    $user = accountWithBankBalance('2026-08-10', 1_000_000);
    connectedBankFor($user);

    syncBank($user)->assertOk()->assertJsonPath('account.balance.source', BankBalanceSource::Manual->value);
});

test('a transaction the bank repeats across pages is recorded once', function (): void {
    fakeEnableBanking([
        'api.enablebanking.com/accounts/*/transactions*' => Http::sequence()
            ->push(['transactions' => [ebTransaction(['entry_reference' => 'E-1'])], 'continuation_key' => 'page-2'])
            ->push(['transactions' => [ebTransaction(['entry_reference' => 'E-1'])], 'continuation_key' => null]),
    ]);
    $user = User::factory()->create();
    connectedBankFor($user);

    syncBank($user)->assertOk()->assertJsonPath('importedCount', 1);

    expect($user->bankMovements()->count())->toBe(1);
});

test('never reads further back than banks serve', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    connectedBankFor($user);
    bankMovementFor($user, configure: fn ($factory) => $factory->state(['booked_on' => '2024-03-01']));

    syncBank($user)->assertOk();

    expect(fetchedFrom())->toBe(['2026-05-15']);
});

test('a reconnection to the same account keeps the overlap on what the sync brought in', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $synced = bankStatementOwnedBy($user, fn ($factory) => $factory->state(['format' => BankStatementFormat::EnableBanking]));
    bankMovementFor($user, $synced, fn ($factory) => $factory->state(['booked_on' => '2026-08-12']));
    // Disconnected since: a fresh connection, without statement or sync date.
    connectedBankFor($user);

    syncBank($user)->assertOk();

    expect(fetchedFrom())->toBe(['2026-08-05']);
});

test('leaves the days a statement file holds to the file', function (): void {
    fakeEnableBanking([
        'api.enablebanking.com/accounts/*/transactions*' => transactionsPage([
            ebTransaction(['entry_reference' => 'E-FILED', 'booking_date' => '2026-08-11']),
            ebTransaction(['entry_reference' => 'E-NEW', 'booking_date' => '2026-08-12']),
        ]),
    ]);
    $user = User::factory()->create();
    connectedBankFor($user);
    bankMovementFor($user, configure: fn ($factory) => $factory->state(['booked_on' => '2026-08-11']));

    syncBank($user)->assertOk()->assertJsonPath('lineCount', 2)->assertJsonPath('importedCount', 1);

    expect($user->bankMovements()->where('booked_on', '2026-08-11')->count())->toBe(1)
        ->and($user->bankMovements()->where('booked_on', '2026-08-12')->count())->toBe(1);
});

test('a later sync reads from its last day less the overlap', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $synced = bankStatementOwnedBy($user, fn ($factory) => $factory->state([
        'format' => BankStatementFormat::EnableBanking,
        'period_start' => '2026-07-01',
        'period_end' => '2026-08-10',
    ]));
    connectedBankFor($user, fn ($factory) => $factory->state(['bank_statement_id' => $synced->id]));

    syncBank($user)->assertOk();

    expect(fetchedFrom())->toBe(['2026-08-03']);
});

test('a successful sync clears the last failure', function (): void {
    fakeEnableBanking();
    $user = User::factory()->create();
    $connection = connectedBankFor($user, fn ($factory) => $factory->state([
        'last_error' => BankSyncError::RateLimited,
        'last_failed_at' => now()->subDay(),
    ]));

    syncBank($user)->assertOk()->assertJsonPath('account.connection.lastError', null);

    expect($connection->refresh()->last_failed_at)->toBeNull();
});
