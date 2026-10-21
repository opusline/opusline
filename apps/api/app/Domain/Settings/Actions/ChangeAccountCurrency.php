<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Bank\Models\BankAccount;
use App\Domain\Settings\Data\UpdateSettingsCurrencyData;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ChangeAccountCurrency
{
    /**
     * @throws ValidationException
     */
    public function handle(UserSettings $settings, UpdateSettingsCurrencyData $data): UserSettings
    {
        if ($data->currency === $settings->currency) {
            return $settings;
        }

        return DB::transaction(function () use ($settings, $data): UserSettings {
            // Serializes against the money-writing actions, which take the same
            // lock before asserting the account currency: without it a priced
            // mission could commit between this check and the update, leaving
            // mixed-currency rows no aggregation could ever sum.
            $user = User::lockRow($settings->user_id);

            if ($user->hasLockedCurrency()) {
                throw ValidationException::withMessages([
                    'currency' => __('settings.currency_locked'),
                ]);
            }

            $settings->update([
                'currency' => $data->currency,
                ...array_fill_keys(UserSettings::CURRENCY_SCOPED_COLUMNS, null),
            ]);

            // A bank account without statements can still hold a typed balance;
            // its cents are in the old currency, like the columns above.
            $user->bankAccounts()->update([
                'currency' => $data->currency->value,
                ...array_fill_keys(BankAccount::CURRENCY_SCOPED_COLUMNS, null),
                'balance_recorded_on' => null,
            ]);

            return $settings;
        });
    }
}
