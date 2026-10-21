<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Bank\Models\BankAccount;
use Spatie\LaravelData\Data;

/**
 * One of the user's bank accounts, beside the others on the Compte pro screen.
 */
class BankAccountEntryData extends Data
{
    public function __construct(
        public int $id,
        /** Null shows the default « Compte pro » label. */
        public ?string $name,
        /** Null until a balance is typed or a statement imported for this account. */
        public ?BankBalanceData $balance,
        public bool $isArchived,
    ) {}

    public static function fromModel(BankAccount $account, ?BankBalanceData $balance): self
    {
        return new self(
            id: $account->id,
            name: $account->name,
            balance: $balance,
            isArchived: $account->isArchived(),
        );
    }
}
