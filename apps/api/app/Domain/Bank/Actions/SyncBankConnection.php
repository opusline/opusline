<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\EnableBanking\BankSyncFailed;
use App\Domain\Bank\EnableBanking\EnableBankingClient;
use App\Domain\Bank\EnableBanking\EnableBankingCredentials;
use App\Domain\Bank\EnableBanking\EnableBankingStatement;
use App\Domain\Bank\EnableBanking\PsuContext;
use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Enums\BankStatementFormat;
use App\Domain\Bank\Enums\BankSyncError;
use App\Domain\Bank\Models\BankConnection;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Bank\Parsing\ParsedMovement;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Facades\DB;

/**
 * Reads the connected account's booked movements since the last sync and
 * records them like an imported statement would be — same deduplication,
 * same reconciliation suggestions — on the connection's one statement row.
 *
 * The bank is asked outside the account lock: its answer can take seconds,
 * and nothing is written until it has been read in full.
 */
class SyncBankConnection
{
    /**
     * Re-read on every sync: card payments are often booked days after the
     * day they carry, so the last days read may have gained movements since.
     */
    private const int OVERLAP_DAYS = 7;

    /** How far back a sync ever reads — about what banks serve without a fresh authentication. */
    private const int MAX_HISTORY_DAYS = 90;

    public function __construct(
        private readonly EnableBankingClient $enableBankingClient,
        private readonly RecordBankMovements $recordBankMovements,
    ) {}

    /**
     * @param  ?PsuContext  $psu  the user's own request when they asked for this sync; null for the nightly run
     * @return array{fetched: int, imported: int, suggestions: int}
     *
     * @throws BankSyncFailed
     */
    public function handle(User $user, ?PsuContext $psu): array
    {
        $settings = $user->settingsOrFail();
        $credentials = EnableBankingCredentials::ofOrFail($settings);
        $connection = $user->bankConnection()->first();

        if ($connection === null || $connection->account_uid === null || $connection->account_identification_hash === null) {
            abort(409, __('bank.sync_not_connected'));
        }

        if ($connection->effectiveStatus() === BankConnectionStatus::Expired) {
            $this->recordFailure($connection, BankSyncError::ConsentExpired);

            throw new BankSyncFailed(BankSyncError::ConsentExpired, 'The bank consent has ended.');
        }

        $currency = $settings->currency->value;
        $to = $settings->today();
        $from = $this->windowStart($user, $connection, $to);

        try {
            $movements = EnableBankingStatement::movements(
                $this->enableBankingClient->transactions($credentials, $connection->account_uid, $from, $to, $psu),
                $currency,
                $connection->account_identification_hash,
            );
            $closingBalance = EnableBankingStatement::closingBalance(
                $this->enableBankingClient->balances($credentials, $connection->account_uid, $psu),
                $currency,
            );
        } catch (BankSyncFailed $exception) {
            $this->recordFailure($connection, $exception->reason);

            throw $exception;
        }

        $recorded = DB::transaction(fn (): array => $this->record($user, $connection->account_uid, $movements, $closingBalance, $from, $to));

        return ['fetched' => count($movements), ...$recorded];
    }

    /**
     * @param  list<ParsedMovement>  $movements
     * @param  ?array{cents: int, on: CarbonImmutable}  $closingBalance
     * @return array{imported: int, suggestions: int}
     */
    private function record(
        User $user,
        string $accountUid,
        array $movements,
        ?array $closingBalance,
        CarbonImmutable $from,
        CarbonImmutable $to,
    ): array {
        $locked = User::lockRow($user->id);
        $settings = $locked->settings()->sole();
        $locked->setRelation('settings', $settings);
        $connection = $locked->bankConnection()->first();

        // Disconnected, or pointed at another account, while the bank answered.
        abort_if($connection === null || $connection->account_uid !== $accountUid, 409, __('bank.sync_not_connected'));

        $currency = $settings->currency->value;
        $statement = $connection->statement ?? $locked->bankStatements()->create([
            'file_name' => $connection->aspsp_name,
            'format' => BankStatementFormat::EnableBanking,
            'period_start' => $from,
            'period_end' => $to,
            'line_count' => 0,
            'currency' => $currency,
        ]);

        $recorded = $this->recordBankMovements->handle($locked, $statement, $movements, $from);

        $this->extendStatement($statement, $recorded['imported'], $closingBalance, $currency, $to);

        $connection->bank_statement_id = $statement->id;
        $this->recordSuccess($connection);

        return $recorded;
    }

    /**
     * @param  ?array{cents: int, on: CarbonImmutable}  $closingBalance
     */
    private function extendStatement(BankStatement $statement, int $importedCount, ?array $closingBalance, string $currency, CarbonImmutable $to): void
    {
        $statement->period_end = $statement->period_end->max($to);
        $statement->line_count += $importedCount;

        // The bank's own figure; it anchors the balance only while nobody
        // typed one (ResolveBankBalance).
        if ($closingBalance !== null) {
            $statement->closing_balance_cents = new Money($closingBalance['cents'], $currency);
            $statement->closing_balance_on = $closingBalance['on'];
        }

        $statement->save();
    }

    /**
     * The first day to read: the last day synced less the overlap, or as far
     * back as banks serve. Days a statement file already covers come back
     * too, and RecordBankMovements leaves them to the file.
     */
    private function windowStart(User $user, BankConnection $connection, CarbonImmutable $today): CarbonImmutable
    {
        $start = $today->subDays(self::MAX_HISTORY_DAYS);
        // A reconnection starts a new statement, but the account's earlier
        // synced rows still deduplicate on the bank's references.
        $lastSyncedDay = $connection->statement->period_end ?? $this->lastSyncedBookedOn($user);

        return $lastSyncedDay instanceof CarbonImmutable
            ? $start->max($lastSyncedDay->subDays(self::OVERLAP_DAYS))
            : $start;
    }

    private function lastSyncedBookedOn(User $user): ?CarbonImmutable
    {
        $syncedStatementIds = $user->bankStatements()->where('format', BankStatementFormat::EnableBanking)->pluck('id');

        if ($syncedStatementIds->isEmpty()) {
            return null;
        }

        // value() hydrates through the CalendarDate cast, unlike max().
        $bookedOn = $user->bankMovements()
            ->whereIn('bank_statement_id', $syncedStatementIds)
            ->orderByDesc('booked_on')
            ->value('booked_on');

        return $bookedOn instanceof CarbonImmutable ? $bookedOn : null;
    }

    private function recordSuccess(BankConnection $connection): void
    {
        $connection->forceFill([
            'status' => BankConnectionStatus::Active,
            'last_synced_at' => now(),
            'last_error' => null,
            'last_failed_at' => null,
        ])->save();
    }

    private function recordFailure(BankConnection $connection, BankSyncError $reason): void
    {
        $connection->forceFill([
            'status' => $reason === BankSyncError::ConsentExpired ? BankConnectionStatus::Expired : $connection->status,
            'last_error' => $reason,
            'last_failed_at' => now(),
        ])->save();
    }
}
