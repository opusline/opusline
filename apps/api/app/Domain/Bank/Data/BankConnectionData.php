<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Bank\EnableBanking\LinkedAccount;
use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Enums\BankSyncError;
use App\Domain\Bank\Models\BankConnection;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class BankConnectionData extends Data
{
    /**
     * @param  list<BankConnectionAccountData>  $accounts
     */
    public function __construct(
        public string $aspspName,
        public BankConnectionStatus $status,
        /** The account being synced; null while the user still has to pick one. */
        public ?BankConnectionAccountData $account,
        /** The accounts the consent covers in the account currency. */
        #[DataCollectionOf(BankConnectionAccountData::class)]
        public array $accounts,
        /** When the consent ends: past it, only a new authorization at the bank syncs again. */
        public string $validUntil,
        public ?string $lastSyncedAt,
        /** Why the last sync failed; null once one succeeds again. */
        public ?BankSyncError $lastError,
    ) {}

    public static function fromModel(BankConnection $connection): self
    {
        $accounts = $connection->candidateAccounts();
        $attached = array_find($accounts, static fn (LinkedAccount $account): bool => $account->uid === $connection->account_uid);

        return new self(
            aspspName: $connection->aspsp_name,
            status: $connection->effectiveStatus(),
            account: $attached instanceof LinkedAccount ? BankConnectionAccountData::fromLinkedAccount($attached) : null,
            accounts: array_map(BankConnectionAccountData::fromLinkedAccount(...), $accounts),
            validUntil: $connection->valid_until->toIso8601String(),
            lastSyncedAt: $connection->last_synced_at?->toIso8601String(),
            lastError: $connection->last_error,
        );
    }
}
