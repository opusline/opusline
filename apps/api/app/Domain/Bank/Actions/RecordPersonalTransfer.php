<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\CreatePersonalTransferData;
use App\Domain\Bank\Models\PersonalTransfer;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class RecordPersonalTransfer
{
    public function handle(User $user, CreatePersonalTransferData $data): PersonalTransfer
    {
        return DB::transaction(function () use ($user, $data): PersonalTransfer {
            AccountCurrency::assertMatchesAccountUnderLock($user->id, $data->amount);

            return $user->personalTransfers()->create([
                'transferred_on' => $data->transferredOn,
                'currency' => $data->amount->currency->value,
                'amount_cents' => $data->amount->amount,
                'note' => $data->note,
            ]);
        });
    }
}
