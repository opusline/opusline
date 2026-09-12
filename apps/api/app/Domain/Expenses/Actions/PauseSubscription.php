<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Models\Subscription;

/**
 * Skips the debits until resumed — the cycle does not shift, and the months
 * skipped are never written afterwards: resuming moves the occurrence floor
 * to today. Idempotent either way.
 */
class PauseSubscription
{
    public function handle(Subscription $subscription, bool $paused): void
    {
        $subscription->update($paused
            ? ['is_paused' => true]
            : ['is_paused' => false, 'occurrences_from' => $subscription->user->settingsOrFail()->today()]);
    }
}
