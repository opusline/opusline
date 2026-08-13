<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\EntryRounding;
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

    /**
     * How much time those entries bill for, in the mission's own unit: minutes on an
     * hourly mission, days on a daily one. Rounded the way each entry is billed, so
     * "3 j" beside an amount means the same three days the amount was priced from.
     *
     * Display only — the amount above never goes through these, it is computed from
     * exact fractions.
     *
     * @param  iterable<TimeEntry>  $entries
     */
    public function billedMinutes(Mission $mission, iterable $entries): int
    {
        $total = 0;

        foreach ($entries as $entry) {
            $total += $this->roundingFor($mission, $entry)->valueMinutes($entry->duration_minutes);
        }

        return $total;
    }

    /**
     * @param  iterable<TimeEntry>  $entries
     */
    public function billedDays(Mission $mission, iterable $entries): float
    {
        $total = 0.0;

        foreach ($entries as $entry) {
            $total += $this->roundingFor($mission, $entry)->valueDayFraction(
                $entry->duration_minutes,
                config()->integer('app.workday_minutes'),
            );
        }

        return $total;
    }

    private function valueEntry(Mission $mission, TimeEntry $entry): Money
    {
        $rate = $mission->rate_cents;

        if (! $this->pricesTime($mission) || ! $rate instanceof Money) {
            return new Money(0, $mission->currency);
        }

        $rounding = $this->roundingFor($mission, $entry);

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

    /**
     * Not $entry->effectiveRounding(): that reaches back through the mission relation,
     * which is not loaded on entries fetched through the mission.
     */
    private function roundingFor(Mission $mission, TimeEntry $entry): EntryRounding
    {
        return $entry->rounding ?? $mission->effectiveRounding();
    }
}
