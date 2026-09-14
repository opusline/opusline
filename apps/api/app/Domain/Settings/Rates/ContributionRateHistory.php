<?php

declare(strict_types=1);

namespace App\Domain\Settings\Rates;

use App\Domain\Settings\Models\ContributionRate;
use App\Domain\Settings\Models\UserSettings;

/**
 * What URSSAF cost on a given day.
 *
 * An account that has never changed its rate holds no rows, and a date older than
 * the first row predates anything recorded — both answer with the rate in the
 * settings, which is the only figure there is.
 */
class ContributionRateHistory
{
    public function timeline(UserSettings $settings): ContributionRateTimeline
    {
        $recorded = ContributionRate::query()
            ->where('user_id', $settings->user_id)
            ->orderByDesc('effective_from')
            ->orderByDesc('id')
            ->get()
            ->all();

        return new ContributionRateTimeline($settings, $recorded);
    }
}
