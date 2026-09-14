<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Models\ContributionRate;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Settings\Rates\LiberatingPayment;

/**
 * Remember the terms an account was on, the day it stops being on them.
 *
 * Called from the two places that can move a contribution rate — a settings save
 * and the official-rates refresh — rather than from a model hook, so every write
 * that changes what URSSAF costs is findable by grepping for this class. Both
 * callers run it inside the transaction that writes the new terms: the record of
 * what the terms *were* must not survive a rollback of what they became.
 *
 * The first change also writes down what the terms *were*, dated from the account's
 * beginning. Without that the history would start at the first edit, and a period
 * that closed before it would fall back to today's rate — which is the bug this
 * exists to fix.
 */
class RecordContributionRate
{
    public function handle(UserSettings $settings, int $previousRateBp, LiberatingPayment $previousLiberatingPayment): void
    {
        $currentRateBp = $settings->effectiveContributionRateBp();
        $current = LiberatingPayment::of($settings);

        // The versement libératoire is asked about on its own: switching it on at
        // a rate of 0 moves no rate, and the annual return still needs the flag.
        if ($currentRateBp === $previousRateBp && $current->isPaid === $previousLiberatingPayment->isPaid) {
            return;
        }

        $history = ContributionRate::query()->where('user_id', $settings->user_id);

        if (! $history->clone()->exists()) {
            ContributionRate::query()->create([
                'user_id' => $settings->user_id,
                'effective_rate_bp' => $previousRateBp,
                'liberating_payment' => $previousLiberatingPayment->isPaid,
                'liberating_payment_rate_bp' => $previousLiberatingPayment->rateBp,
                'effective_from' => $settings->created_at->toDateString(),
            ]);
        }

        ContributionRate::query()->updateOrCreate(
            [
                'user_id' => $settings->user_id,
                'effective_from' => $settings->today()->toDateString(),
            ],
            [
                'effective_rate_bp' => $currentRateBp,
                'liberating_payment' => $current->isPaid,
                'liberating_payment_rate_bp' => $current->rateBp,
            ],
        );
    }
}
