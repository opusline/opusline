<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Subscription;

/** Skips the debits until resumed — the cycle does not shift. Idempotent either way. */
class PauseSubscription
{
    public function handle(Subscription $subscription, bool $paused): void
    {
        $subscription->update(['is_paused' => $paused]);
    }
}
