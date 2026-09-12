<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Subscriptions;

use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use App\Domain\Expenses\Models\Subscription;
use Carbon\CarbonImmutable;

/**
 * When a subscription debits. The cycle is anchored on its first debit —
 * the first time its day comes round on or after the start date — and
 * steps by its periodicity; an annual one debits on its own day and month.
 * A debit day past the month's end lands on the last day.
 *
 * Occurrences run to the cancellation date, and never while paused —
 * pausing skips, it does not shift.
 */
final readonly class OccurrenceSchedule
{
    public function __construct(private Subscription $subscription) {}

    /**
     * The debit dates falling in [$from, $to], within the subscription's own life.
     *
     * @return list<CarbonImmutable>
     */
    public function debitsBetween(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $debits = [];
        $lastDay = $this->subscription->cancelled_on ?? $to;

        for ($cursor = $this->firstDebit(); $cursor->lessThanOrEqualTo(min($to, $lastDay)); $cursor = $this->debitAfter($cursor)) {
            if ($cursor->greaterThanOrEqualTo($from)) {
                $debits[] = $cursor;
            }
        }

        return $debits;
    }

    /** The first debit after $today, or null once the subscription no longer debits. */
    public function nextDebitOn(CarbonImmutable $today): ?CarbonImmutable
    {
        if (! $this->subscription->isActiveOn($today)) {
            return null;
        }

        $cursor = $this->firstDebit();

        while ($cursor->lessThanOrEqualTo($today)) {
            $cursor = $this->debitAfter($cursor);
        }

        $cancelledOn = $this->subscription->cancelled_on;

        return $cancelledOn instanceof CarbonImmutable && $cursor->greaterThan($cancelledOn) ? null : $cursor;
    }

    /**
     * The given day of each month inside [$from, $to], clamped the way a
     * debit day is — the rail's monthly provision lines.
     *
     * @return list<CarbonImmutable>
     */
    public static function dayOfEachMonthBetween(int $day, CarbonImmutable $from, CarbonImmutable $to): array
    {
        $days = [];

        for ($month = $from->startOfMonth(); $month->lessThanOrEqualTo($to); $month = $month->addMonth()) {
            $candidate = self::onDay($month, $day);

            if ($candidate->betweenIncluded($from, $to)) {
                $days[] = $candidate;
            }
        }

        return $days;
    }

    private function firstDebit(): CarbonImmutable
    {
        $startedOn = $this->subscription->started_on;
        $annual = $this->subscription->periodicity === SubscriptionPeriodicity::Annual;
        $debit = $this->debitIn($annual ? $startedOn->startOfYear() : $startedOn->startOfMonth());

        // Before the start, the day comes round again a month (or a year)
        // later; the cycle is anchored where it first lands.
        while ($debit->lessThan($startedOn)) {
            $debit = $annual ? $this->debitAfter($debit) : $this->debitIn($debit->startOfMonth()->addMonth());
        }

        return $debit;
    }

    private function debitAfter(CarbonImmutable $debit): CarbonImmutable
    {
        return $this->debitIn($debit->startOfMonth()->addMonths($this->subscription->periodicity->months()));
    }

    /** The debit of the cycle starting on $monthStart. */
    private function debitIn(CarbonImmutable $monthStart): CarbonImmutable
    {
        $debitMonth = $this->subscription->debit_month;
        $month = $this->subscription->periodicity === SubscriptionPeriodicity::Annual && $debitMonth !== null
            ? $monthStart->setMonth($debitMonth)
            : $monthStart;

        return self::onDay($month, $this->subscription->debit_day);
    }

    private static function onDay(CarbonImmutable $month, int $day): CarbonImmutable
    {
        return $month->setDay(min($day, $month->daysInMonth));
    }
}
