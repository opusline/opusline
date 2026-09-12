<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Subscription;

/** Undoes a cancellation; the months in between are never written, the debits resume from today. */
class ReactivateSubscription
{
    public function handle(Subscription $subscription): void
    {
        $subscription->update(['cancelled_on' => null, 'occurrences_from' => $subscription->user->settingsOrFail()->today()]);
    }
}
