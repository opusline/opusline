<?php

declare(strict_types=1);

namespace App\Domain\Settings\Rates;

use App\Domain\Settings\Models\ContributionRate;
use App\Domain\Settings\Models\UserSettings;
use Carbon\CarbonImmutable;

/**
 * An account's recorded rates, loaded once so a run over many closed periods
 * prices each at the rate that applied then without a query apiece.
 */
final readonly class ContributionRateTimeline
{
    /**
     * @param  array<int, ContributionRate>  $recorded  most recent first
     */
    public function __construct(
        private UserSettings $settings,
        private array $recorded,
    ) {}

    public function onDate(CarbonImmutable $date): int
    {
        $dateString = $date->toDateString();

        foreach ($this->recorded as $rate) {
            if ($rate->effective_from->toDateString() <= $dateString) {
                return $rate->effective_rate_bp;
            }
        }

        return $this->settings->effectiveContributionRateBp();
    }
}
