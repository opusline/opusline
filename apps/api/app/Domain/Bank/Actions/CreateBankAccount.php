<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\CreateBankAccountData;
use App\Domain\Users\Models\User;

/**
 * An account fed by imported files only, next to the others — a connection
 * opens its own account when it needs one.
 */
class CreateBankAccount
{
    public function handle(User $user, CreateBankAccountData $data): void
    {
        $user->bankAccounts()->create([
            'name' => trim($data->name),
            'currency' => $user->settingsOrFail()->currency->value,
        ]);
    }
}
