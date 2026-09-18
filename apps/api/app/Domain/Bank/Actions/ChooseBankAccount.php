<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\ChooseBankAccountData;
use App\Domain\Bank\EnableBanking\BankSyncFailed;
use App\Domain\Bank\EnableBanking\LinkedAccount;
use App\Domain\Bank\Enums\BankConnectionStatus;
use App\Domain\Bank\Enums\BankSyncError;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ChooseBankAccount
{
    public function handle(User $user, ChooseBankAccountData $data): void
    {
        DB::transaction(function () use ($user, $data): void {
            $connection = User::lockRow($user->id)->bankConnection()->first();

            abort_if($connection === null, 409, __('bank.sync_not_connected'));
            // Its session is gone: only a new authorization at the bank revives it.
            if ($connection->effectiveStatus() === BankConnectionStatus::Expired) {
                throw new BankSyncFailed(BankSyncError::ConsentExpired, 'The bank consent has ended.');
            }

            $account = array_find(
                $connection->candidateAccounts(),
                static fn (LinkedAccount $candidate): bool => $candidate->uid === $data->accountUid,
            );

            if (! $account instanceof LinkedAccount) {
                throw ValidationException::withMessages(['accountUid' => __('bank.sync_unknown_account')]);
            }

            $connection->attachAccount($account);
            $connection->save();
        });
    }
}
