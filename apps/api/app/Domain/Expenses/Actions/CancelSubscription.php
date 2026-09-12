<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\CancelSubscriptionData;
use App\Domain\Expenses\Models\Subscription;
use Carbon\CarbonImmutable;

/** Ends the debits after a day — today unless one is given; the row keeps its history. */
class CancelSubscription
{
    public function handle(Subscription $subscription, CancelSubscriptionData $data): void
    {
        $subscription->update(['cancelled_on' => $data->cancelledOn === null
            ? $subscription->user->settingsOrFail()->today()
            : CarbonImmutable::parse($data->cancelledOn)]);
    }
}
