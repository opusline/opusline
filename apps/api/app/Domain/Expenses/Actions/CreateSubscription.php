<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\SubscriptionInputData;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class CreateSubscription
{
    public function __construct(private readonly ValidateSubscriptionTerms $validateSubscriptionTerms) {}

    public function handle(User $user, SubscriptionInputData $data): Subscription
    {
        $this->validateSubscriptionTerms->handle($data);

        return DB::transaction(function () use ($user, $data): Subscription {
            AccountCurrency::assertMatchesAccountUnderLock($user->id, $data->amountHt);

            $subscription = $user->subscriptions()->create([
                ...SubscriptionAttributes::from($data),
                'occurrences_from' => $user->settingsOrFail()->today(),
            ]);
            $subscription->amounts()->create([
                'effective_from' => $data->startedOn,
                'currency' => $data->amountHt->currency->value,
                'amount_ht_cents' => $data->amountHt->amount,
            ]);

            return $subscription;
        });
    }
}
