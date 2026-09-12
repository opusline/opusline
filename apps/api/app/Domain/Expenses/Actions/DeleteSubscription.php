<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Subscription;

/** Removes the subscription and its price history; the expenses it created stay in the journal. */
class DeleteSubscription
{
    public function handle(Subscription $subscription): void
    {
        $subscription->delete();
    }
}
