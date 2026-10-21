<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Models\BankAccount;
use App\Domain\Users\Models\User;
use Illuminate\Validation\ValidationException;

/**
 * The bank account a typed balance or an imported file is about. Naming one
 * is only required once there is a choice between open accounts: the first
 * write opens the account nothing else created yet, and a single open account
 * is the obvious target.
 *
 * Runs under the caller's User::lockRow(), so two first writes cannot open two
 * accounts.
 */
class ResolveTargetBankAccount
{
    public function handle(User $locked, ?int $bankAccountId, string $field = 'bankAccountId'): BankAccount
    {
        if ($bankAccountId !== null) {
            $account = $locked->bankAccounts()->whereKey($bankAccountId)->first();

            if (! $account instanceof BankAccount) {
                throw ValidationException::withMessages([$field => __('bank.account_unknown')]);
            }

            return $account;
        }

        // A closed account takes a file only when it is named.
        $accounts = $locked->bankAccounts()->whereNull('archived_at')->limit(2)->get();

        if ($accounts->count() > 1) {
            throw ValidationException::withMessages([$field => __('bank.account_required')]);
        }

        return $accounts->first() ?? $locked->bankAccounts()->create([
            'currency' => $locked->settingsOrFail()->currency->value,
        ]);
    }
}
