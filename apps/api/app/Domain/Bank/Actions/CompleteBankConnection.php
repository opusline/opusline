<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\CompleteBankConnectionData;
use App\Domain\Bank\EnableBanking\BankSyncFailed;
use App\Domain\Bank\EnableBanking\EnableBankingClient;
use App\Domain\Bank\EnableBanking\EnableBankingCredentials;
use App\Domain\Bank\EnableBanking\LinkedAccount;
use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Enums\BankSyncError;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Turns the code the bank sent the browser back with into the account's bank
 * connection. A reconnection — after the consent lapsed, or to another bank —
 * updates the same connection, so the sync resumes where it stopped when the
 * account is the same one.
 */
class CompleteBankConnection
{
    public function __construct(
        private readonly EnableBankingClient $enableBankingClient,
    ) {}

    public function handle(User $user, CompleteBankConnectionData $data): void
    {
        $aspspName = $this->pullPendingAuthorization($user, $data->state);
        $settings = $user->settingsOrFail();
        $credentials = EnableBankingCredentials::ofOrFail($settings);

        try {
            $session = $this->enableBankingClient->createSession($credentials, $data->code);
        } catch (BankSyncFailed $exception) {
            if ($exception->reason === BankSyncError::ConsentExpired) {
                throw ValidationException::withMessages(['code' => __('bank.sync_authorization_expired')]);
            }

            throw $exception;
        }

        $candidates = array_values(array_filter(
            $session->accounts,
            static fn (LinkedAccount $account): bool => $account->currency === $settings->currency->value,
        ));

        if ($candidates === []) {
            $this->enableBankingClient->revokeSession($credentials, $session->id);

            throw new BankSyncFailed(BankSyncError::CurrencyMismatch, 'The consent covers no account in the account currency.');
        }

        $replacedSessionId = DB::transaction(function () use ($user, $aspspName, $session, $candidates): ?string {
            $locked = User::lockRow($user->id);
            $connection = $locked->bankConnection()->first() ?? $locked->bankConnection()->make();
            $replacedSessionId = $connection->exists ? $connection->session_id : null;

            $connection->forceFill([
                'aspsp_name' => $aspspName,
                'status' => BankConnectionStatus::AwaitingAccount,
                'session_id' => $session->id,
                'accounts' => array_map(static fn (LinkedAccount $account): array => $account->toArray(), $candidates),
                'valid_until' => $session->validUntil,
                // Account uids only live as long as the session that issued them.
                'account_uid' => null,
                'last_error' => null,
                'last_failed_at' => null,
            ]);

            $account = $this->accountToAttach($candidates, $connection->account_identification_hash);

            if ($account instanceof LinkedAccount) {
                $connection->attachAccount($account);
            }

            $connection->save();

            return $replacedSessionId;
        });

        if ($replacedSessionId !== null) {
            $this->enableBankingClient->revokeSession($credentials, $replacedSessionId);
        }
    }

    /** The bank the authorization was opened at. */
    private function pullPendingAuthorization(User $user, string $state): string
    {
        $pending = Cache::pull(StartBankConnection::stateKey($state));

        // Single use, and only for the account that opened it: a code relayed
        // to another session must not attach someone else's bank.
        if (! is_array($pending) || ($pending['userId'] ?? null) !== $user->id || ! is_string($pending['aspspName'] ?? null)) {
            throw ValidationException::withMessages(['state' => __('bank.sync_authorization_expired')]);
        }

        return $pending['aspspName'];
    }

    /**
     * The account to sync without asking: the only candidate, or the one
     * synced before this reconnection.
     *
     * @param  non-empty-list<LinkedAccount>  $candidates
     */
    private function accountToAttach(array $candidates, ?string $previousIdentificationHash): ?LinkedAccount
    {
        if (count($candidates) === 1) {
            return $candidates[0];
        }

        return array_find(
            $candidates,
            static fn (LinkedAccount $account): bool => $account->identificationHash === $previousIdentificationHash,
        );
    }
}
