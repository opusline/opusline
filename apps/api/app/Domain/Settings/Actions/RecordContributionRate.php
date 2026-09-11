<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Models\ContributionRate;
use App\Domain\Settings\Models\UserSettings;

/**
 * Remember the rate an account was on, the day it stops being on it.
 *
 * Called from the two places that can move a contribution rate — a settings save
 * and the official-rates refresh — rather than from a model hook, so every write
 * that changes what URSSAF costs is findable by grepping for this class.
 *
 * The first change also writes down what the rate *was*, dated from the account's
 * beginning. Without that the history would start at the first edit, and a period
 * that closed before it would fall back to today's rate — which is the bug this
 * exists to fix.
 */
class RecordContributionRate
{
    public function handle(UserSettings $settings, int $previousRateBp): void
    {
        $current = $settings->effectiveContributionRateBp();

        if ($current === $previousRateBp) {
            return;
        }

        $history = ContributionRate::query()->where('user_id', $settings->user_id);

        if (! $history->clone()->exists()) {
            ContributionRate::query()->create([
                'user_id' => $settings->user_id,
                'effective_rate_bp' => $previousRateBp,
                'effective_from' => $settings->created_at->toDateString(),
            ]);
        }

        ContributionRate::query()->updateOrCreate(
            [
                'user_id' => $settings->user_id,
                'effective_from' => $settings->today()->toDateString(),
            ],
            ['effective_rate_bp' => $current],
        );
    }
}
