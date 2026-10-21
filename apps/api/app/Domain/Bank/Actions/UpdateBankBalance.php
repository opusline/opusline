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
    public function __construct(
        private readonly ResolveTargetBankAccount $resolveTargetBankAccount,
    ) {}

    public function handle(User $user, UpdateBankBalanceData $data): void
    {
        DB::transaction(function () use ($user, $data): void {
            $locked = User::lockRow($user->id);
            $settings = $locked->settings()->sole();
            $locked->setRelation('settings', $settings);
            $account = $this->resolveTargetBankAccount->handle($locked, $data->bankAccountId);

            if (! $data->balance instanceof SignedMoneyData) {
                $account->update([
                    'balance_cents' => null,
                    'balance_recorded_on' => null,
                ]);

                return;
            }

            AccountCurrency::assertMatchesSettings($settings, $data->balance);

            $account->update([
                'currency' => $settings->currency->value,
                'balance_cents' => $data->balance->toMoney(),
                'balance_recorded_on' => $settings->today(),
            ]);
        });
    }
}
