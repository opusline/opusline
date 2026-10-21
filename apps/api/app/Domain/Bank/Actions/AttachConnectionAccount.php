<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\EnableBanking\LinkedAccount;
use App\Domain\Bank\Models\BankAccount;
use App\Domain\Bank\Models\BankConnection;
use App\Domain\Features\Enums\FeatureFlag;
use App\Domain\Features\FeatureFlags;
use App\Domain\Users\Models\User;
use Illuminate\Validation\ValidationException;

/**
 * Points a connection at one of its consent's accounts, and at the bank
 * account in Opusline that account's movements land in.
 *
 * The bank's fingerprint finds an account synced before, through any earlier
 * consent. A first connection feeds the account the user's imported files
 * already fill. Past that, an unknown account opens one of its own — or,
 * without the multi-account beta, there is only ever one account to feed.
 *
 * Runs under the caller's User::lockRow(); the caller saves the connection.
 */
class AttachConnectionAccount
{
    public function __construct(
        private readonly FeatureFlags $featureFlags,
    ) {}

    public function handle(User $locked, BankConnection $connection, LinkedAccount $linked): void
    {
        $account = $this->accountFor($locked, $linked);

        $isSyncedElsewhere = $locked->bankConnections()
            ->where('bank_account_id', $account->id)
            ->when($connection->exists, static fn ($query) => $query->whereKeyNot($connection->id))
            ->exists();

        if ($isSyncedElsewhere) {
            throw ValidationException::withMessages(['accountUid' => __('bank.sync_account_already_connected')]);
        }

        $account->forceFill([
            'name' => $account->name ?? $connection->aspsp_name,
            'identification_hash' => $linked->identificationHash,
            'archived_at' => null,
        ])->save();

        $connection->attachAccount($linked, $account);
    }

    private function accountFor(User $locked, LinkedAccount $linked): BankAccount
    {
        $known = $locked->bankAccounts()->where('identification_hash', $linked->identificationHash)->first();

        if ($known instanceof BankAccount) {
            return $known;
        }

        $accounts = $locked->bankAccounts()->with('connection')->orderBy('id')->get();
        $isMultiAccount = $this->featureFlags->isActive($locked, FeatureFlag::BankAccounts);
        $onlyAccount = $accounts->count() === 1 ? $accounts->sole() : null;

        if (! $isMultiAccount && $onlyAccount instanceof BankAccount) {
            return $onlyAccount;
        }

        $isFileOnly = $onlyAccount instanceof BankAccount
            && $onlyAccount->identification_hash === null
            && $onlyAccount->connection === null;

        if ($isFileOnly) {
            return $onlyAccount;
        }

        return $locked->bankAccounts()->create([
            'currency' => $locked->settingsOrFail()->currency->value,
        ]);
    }
}
