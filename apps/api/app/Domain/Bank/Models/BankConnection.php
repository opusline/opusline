<?php

declare(strict_types=1);

namespace App\Domain\Bank\Models;

use App\Domain\Bank\EnableBanking\LinkedAccount;
use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Enums\BankSyncError;
use App\Domain\Bank\Factories\BankConnectionFactory;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * The account's consent at its bank, through Enable Banking, and how far the
 * sync has read.
 *
 * @property int $id
 * @property int $user_id
 * @property ?int $bank_statement_id
 * @property string $aspsp_name
 * @property BankConnectionStatus $status
 * @property string $session_id
 * @property list<array{uid: string, identificationHash: string, name: ?string, ibanLast4: ?string, currency: string}> $accounts
 * @property ?string $account_uid
 * @property ?string $account_identification_hash
 * @property CarbonImmutable $valid_until
 * @property ?CarbonImmutable $last_synced_at
 * @property ?BankSyncError $last_error
 * @property ?CarbonImmutable $last_failed_at
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 * @property-read ?BankStatement $statement
 */
#[Hidden(['session_id'])]
class BankConnection extends Model
{
    /** @use HasFactory<BankConnectionFactory> */
    use HasFactory;

    protected static function newFactory(): BankConnectionFactory
    {
        return BankConnectionFactory::new();
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'status' => BankConnectionStatus::class,
            'accounts' => 'array',
            'valid_until' => 'datetime',
            'last_synced_at' => 'datetime',
            'last_error' => BankSyncError::class,
            'last_failed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<BankStatement, $this> */
    public function statement(): BelongsTo
    {
        return $this->belongsTo(BankStatement::class, 'bank_statement_id');
    }

    /**
     * The status as of now: a consent past its end is expired whether or not
     * a sync has run into it yet.
     */
    public function effectiveStatus(): BankConnectionStatus
    {
        return $this->valid_until->isPast() ? BankConnectionStatus::Expired : $this->status;
    }

    /**
     * @return list<LinkedAccount>
     */
    public function candidateAccounts(): array
    {
        return array_map(LinkedAccount::fromArray(...), $this->accounts);
    }

    /**
     * Points the connection at one account. Another account than the one
     * synced so far starts a statement of its own, from its own first sync.
     */
    public function attachAccount(LinkedAccount $account): void
    {
        if ($this->account_identification_hash !== $account->identificationHash) {
            $this->bank_statement_id = null;
        }

        $this->account_uid = $account->uid;
        $this->account_identification_hash = $account->identificationHash;
        $this->status = BankConnectionStatus::Active;
    }
}
