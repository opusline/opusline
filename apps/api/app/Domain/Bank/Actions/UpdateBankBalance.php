<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\UpdateBankBalanceData;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateBankBalance
{
    public function handle(User $user, UpdateBankBalanceData $data): void
    {
        DB::transaction(function () use ($user, $data): void {
            $locked = User::lockRow($user->id);
            $settings = $locked->settings()->sole();

            if (! $data->balance instanceof SignedMoneyData) {
                $settings->update([
                    'bank_balance_cents' => null,
                    'bank_balance_recorded_on' => null,
                ]);

                return;
            }

            AccountCurrency::assertMatchesSettings($settings, $data->balance);

            $settings->update([
                'bank_balance_cents' => $data->balance->toMoney(),
                'bank_balance_recorded_on' => $settings->today(),
            ]);
        });
    }
}
