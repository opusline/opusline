<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\RecordTreasuryTransferData;
use App\Domain\Bank\Models\TreasuryTransfer;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

class RecordTreasuryTransfer
{
    public function handle(User $user, RecordTreasuryTransferData $data): TreasuryTransfer
    {
        $transferredOn = $data->transferredOn === null
            ? $user->settingsOrFail()->today()
            : CarbonImmutable::parse($data->transferredOn);

        return DB::transaction(function () use ($user, $data, $transferredOn): TreasuryTransfer {
            AccountCurrency::assertMatchesAccountUnderLock($user->id, $data->amount);

            return $user->treasuryTransfers()->create([
                // Currency first: MoneyIntegerCast reads it when writing the amount.
                'currency' => $data->amount->currency->value,
                'amount_cents' => $data->amount->toMoney(),
                'transferred_on' => $transferredOn,
                'note' => $data->note,
            ]);
        });
    }
}
