<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ChangeSubscriptionAmountData;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Shared\Validation\AccountCurrency;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * A new price from a given day; a second change dated the same day
 * replaces the first. A day before the first debit is refused: the opening
 * price would still win, and the change card would report a change that
 * never happened.
 */
class ChangeSubscriptionAmount
{
    /**
     * @throws ValidationException
     */
    public function handle(Subscription $subscription, ChangeSubscriptionAmountData $data): void
    {
        if (CarbonImmutable::parse($data->effectiveFrom)->lessThan($subscription->started_on)) {
            throw ValidationException::withMessages(['effectiveFrom' => __('rules.subscription_amount_before_start')]);
        }

        DB::transaction(function () use ($subscription, $data): void {
            AccountCurrency::assertMatchesAccountUnderLock($subscription->user_id, $data->amountHt);

            $subscription->amounts()->updateOrCreate(
                ['effective_from' => $data->effectiveFrom],
                ['currency' => $data->amountHt->currency->value, 'amount_ht_cents' => $data->amountHt->amount],
            );
        });
    }
}
