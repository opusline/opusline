<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Users\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\ValidationException;

/**
 * Every amount an account writes must be denominated in the account currency.
 * The currency still travels on the wire so a mismatch fails loudly as a 422
 * instead of being silently re-labelled server-side.
 */
class AccountCurrency implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = auth()->user();

        // The loaded-relation property, not settings()->sole(): the rule runs
        // once per money field, and the relation caches on the request's User
        // so N fields cost one query. No authenticated account fails closed —
        // a wrongly-accepted amount would silently re-label the account
        // through MoneyCast's currency side effect.
        if (! $user instanceof User || $value !== $user->settings?->currency->value) {
            $fail(__('settings.currency_mismatch'));
        }
    }

    /**
     * The write-time twin of the request rule, for use under the user-row lock:
     * request validation reads the account currency before the lock is taken,
     * so a concurrent currency change could slip between the two. Re-checking
     * inside the transaction closes that window.
     *
     * @throws ValidationException
     */
    public static function assertMatchesAccount(User $user, MoneyData|SignedMoneyData $money): void
    {
        self::assertMatchesSettings($user->settings()->sole(), $money);
    }

    /**
     * The same assert against a settings row the caller already holds under
     * the lock — no re-query, one spelling of the invariant.
     *
     * @throws ValidationException
     */
    public static function assertMatchesSettings(UserSettings $settings, MoneyData|SignedMoneyData $money): void
    {
        if ($money->currency !== $settings->currency) {
            throw ValidationException::withMessages([
                'currency' => __('settings.currency_mismatch'),
            ]);
        }
    }

    /**
     * Takes the user-row lock and re-checks in one call, so the lock and the
     * assert cannot drift apart as the pairing spreads to new money writers.
     * ChangeAccountCurrency takes the same lock — the two writes serialize.
     *
     * @throws ValidationException
     */
    public static function assertMatchesAccountUnderLock(int $userId, MoneyData|SignedMoneyData $money): void
    {
        $user = User::lockRow($userId);

        self::assertMatchesAccount($user, $money);
    }
}
