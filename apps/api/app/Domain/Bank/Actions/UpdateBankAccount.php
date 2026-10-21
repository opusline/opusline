<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\UpdateBankAccountData;
use App\Domain\Bank\Models\BankAccount;
use Illuminate\Validation\ValidationException;

class UpdateBankAccount
{
    public function handle(BankAccount $account, UpdateBankAccountData $data): void
    {
        // A connection still brings in movements: the account is not closed.
        if ($data->archived && $account->connection()->exists()) {
            throw ValidationException::withMessages(['archived' => __('bank.account_archive_connected')]);
        }

        $name = $data->name === null ? null : trim($data->name);

        $account->update([
            'name' => $name === '' ? null : $name,
            'archived_at' => $data->archived ? ($account->archived_at ?? now()) : null,
        ]);
    }
}
