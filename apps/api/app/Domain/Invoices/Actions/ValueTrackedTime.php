<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use Cknow\Money\Money;
use Money\Money as MoneyPhp;

/**
 * What one tracked entry is worth at its mission's rate, and how much time it bills
 * for.
 *
 * Each entry is priced on its own, matching how TimeEntryData already reports
 * valuedMinutes/valuedDayFraction per entry — an invoice bills lines, not a single
 * rounded total. Callers total the lines themselves, which is also what lets them
 * total several subsets in one pass.
 */
class ValueTrackedTime
{
    private const int MINUTES_PER_HOUR = 60;

    private readonly int $workdayMinutes;

    public function __construct()
    {
        $this->workdayMinutes = config()->integer('app.workday_minutes');
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
     * What the entry bills: its value, and the quantity behind it in the mission's own
     * unit — days on a day-billed mission, minutes on an hourly one.
     *
     * The quantities are for display. The value never goes through them: it is derived
     * from an exact fraction, because 1/3 of a day has no float to round from.
     *
     * @return array{value: Money, days: float, minutes: int}
     */
    public function measure(Mission $mission, TimeEntry $entry): array
    {
        // Not $entry->effectiveRounding(): that reaches back through the mission
        // relation, which is not loaded on entries fetched through the mission.
        $rounding = $entry->rounding ?? $mission->effectiveRounding();
        $rate = $mission->rate_cents;
        $isHourly = $mission->billing_mode === BillingMode::Hourly;

        if (! $this->pricesTime($mission) || ! $rate instanceof Money) {
            return ['value' => new Money(0, $mission->currency), 'days' => 0.0, 'minutes' => 0];
        }

        if ($isHourly) {
            $minutes = $rounding->valueMinutes($entry->duration_minutes);

            return [
                'value' => $rate->multiply($minutes)->divide(self::MINUTES_PER_HOUR, MoneyPhp::ROUND_HALF_UP),
                'days' => 0.0,
                'minutes' => $minutes,
            ];
        }

        [$numerator, $denominator] = $rounding->billedDayFraction($entry->duration_minutes, $this->workdayMinutes);

        return [
            'value' => $rate->multiply($numerator)->divide($denominator, MoneyPhp::ROUND_HALF_UP),
            'days' => $numerator / $denominator,
            'minutes' => 0,
        ];
    }
}
