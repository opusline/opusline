<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\SubscriptionInputData;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Shared\Validation\AccountCurrency;
use Illuminate\Support\Facades\DB;

/**
 * A full replace of the terms. The amount on the sheet is the price from
 * today: when it differs from the one in force, a new history row takes
 * effect today and earlier debits keep their price. Before the first
 * debit there is nothing to keep, so the opening price is rewritten.
 */
class UpdateSubscription
{
    public function __construct(private readonly ValidateSubscriptionTerms $validateSubscriptionTerms) {}

    public function handle(Subscription $subscription, SubscriptionInputData $data): Subscription
    {
        $this->validateSubscriptionTerms->handle($data);

        return DB::transaction(function () use ($subscription, $data): Subscription {
            AccountCurrency::assertMatchesAccountUnderLock($subscription->user_id, $data->amountHt);

            $subscription->fill(SubscriptionAttributes::from($data))->save();

            $today = $subscription->user->settingsOrFail()->today();

            if (! $subscription->priceOn($today)->equals($data->amountHt->toMoney())) {
                $subscription->amounts()->updateOrCreate(
                    ['effective_from' => max($today, $subscription->started_on)->toDateString()],
                    ['currency' => $data->amountHt->currency->value, 'amount_ht_cents' => $data->amountHt->amount],
                );
            }

            return $subscription;
        });
    }
}
