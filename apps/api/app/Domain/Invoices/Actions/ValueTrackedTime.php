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
     * Not $entry->effectiveRounding(): that reaches back through the mission
     * relation, which is not loaded on entries fetched through the mission.
     */
    private function roundingFor(Mission $mission, TimeEntry $entry): EntryRounding
    {
        return $entry->rounding ?? $mission->effectiveRounding();
    }

    /**
     * How much of the mission's own unit the entry bills, whether or not the
     * mission prices it: days on a day-billed mission, minutes on an hourly one,
     * exactly one of the two set.
     *
     * measure() zeroes these for a mission that prices no time, because it is
     * answering "what does this bill". A fixed-price mission still tracks days
     * worth counting, so the quantity has to be askable on its own.
     *
     * @return array{days: ?float, minutes: ?int}
     */
    public function quantityFor(Mission $mission, TimeEntry $entry, int $workdayMinutes): array
    {
        $rounding = $this->roundingFor($mission, $entry);

        if (! $mission->billing_mode->usesDayFraction()) {
            return ['days' => null, 'minutes' => $rounding->valueMinutes($entry->duration_minutes)];
        }

        return [
            'days' => $rounding->valueDayFraction($entry->duration_minutes, $workdayMinutes),
            'minutes' => null,
        ];
    }

    /**
     * What one entry costs a forfait's budget, valued at the reference daily rate the
     * caller has already resolved.
     *
     * Deliberately not part of measure(): this figure never bills anything. It exists
     * so a fixed price can be read against the time it is eating.
     *
     * @return array{value: Money, days: float}
     */
    public function consumeAtReferenceRate(Mission $mission, TimeEntry $entry, int $workdayMinutes, Money $referenceRate): array
    {
        return $this->pricedDayFraction($referenceRate, $this->roundingFor($mission, $entry), $entry, $workdayMinutes);
    }

    /**
     * A day-billed entry at a given rate. The value never goes through the day count:
     * it is derived from the exact fraction, because 1/3 of a day has no float to
     * round from.
     *
     * @return array{value: Money, days: float}
     */
    private function pricedDayFraction(Money $rate, EntryRounding $rounding, TimeEntry $entry, int $workdayMinutes): array
    {
        [$numerator, $denominator] = $rounding->billedDayFraction($entry->duration_minutes, $workdayMinutes);

        return [
            'value' => $rate->multiply($numerator)->divide($denominator, MoneyPhp::ROUND_HALF_UP),
            'days' => $numerator / $denominator,
        ];
    }

    /**
     * What the entry bills: its value, and the quantity behind it in the mission's own
     * unit — days on a day-billed mission, minutes on an hourly one.
     *
     * The quantities are for display.
     *
     * @return array{value: Money, days: float, minutes: int}
     */
    public function measure(Mission $mission, TimeEntry $entry, int $workdayMinutes): array
    {
        $rounding = $this->roundingFor($mission, $entry);
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

        $priced = $this->pricedDayFraction($rate, $rounding, $entry, $workdayMinutes);

        return ['value' => $priced['value'], 'days' => $priced['days'], 'minutes' => 0];
    }
}
