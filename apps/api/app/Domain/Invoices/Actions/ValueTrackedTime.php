<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use Cknow\Money\Money;
use Money\Money as MoneyPhp;

/**
 * What tracked time is worth at its mission's rate.
 *
 * Each entry is priced on its own, matching how TimeEntryData already reports
 * valuedMinutes/valuedDayFraction per entry — an invoice bills lines, not a single
 * rounded total.
 */
class ValueTrackedTime
{
    private const int MINUTES_PER_HOUR = 60;

    /**
     * @param  iterable<TimeEntry>  $entries
     */
    public function handle(Mission $mission, iterable $entries): Money
    {
        $total = new Money(0, $mission->currency);

        foreach ($entries as $entry) {
            $total = $total->add($this->valueEntry($mission, $entry));
        }

        return $total;
    }

    /**
     * A mission with no rate, or one billed as a fixed price, has no per-entry value:
     * its time is tracked for effort and margin, not to be multiplied by anything.
     */
    public function pricesTime(Mission $mission): bool
    {
        return $mission->rate_cents instanceof Money
            && $mission->billing_mode !== BillingMode::Fixed;
    }

    private function valueEntry(Mission $mission, TimeEntry $entry): Money
    {
        $rate = $mission->rate_cents;

        if (! $this->pricesTime($mission) || ! $rate instanceof Money) {
            return new Money(0, $mission->currency);
        }

        // Not $entry->effectiveRounding(): that reaches back through the mission
        // relation, which is not loaded on entries fetched through the mission.
        $rounding = $entry->rounding ?? $mission->effectiveRounding();

        if ($mission->billing_mode === BillingMode::Hourly) {
            return $rate
                ->multiply($rounding->valueMinutes($entry->duration_minutes))
                ->divide(self::MINUTES_PER_HOUR, MoneyPhp::ROUND_HALF_UP);
        }

        [$numerator, $denominator] = $rounding->billedDayFraction(
            $entry->duration_minutes,
            config()->integer('app.workday_minutes'),
        );

        return $rate->multiply($numerator)->divide($denominator, MoneyPhp::ROUND_HALF_UP);
    }
}
