<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Subscription;

class ReactivateSubscription
{
    public function handle(Subscription $subscription): void
    {
        $subscription->update(['cancelled_on' => null]);
    }
}
