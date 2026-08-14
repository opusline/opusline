<?php

declare(strict_types=1);

namespace App\Domain\Missions\Enums;

/**
 * Rounding increment for time entries, expressed as a fraction of the
 * mission's billing unit: half or a quarter of a day/hour, or to the minute.
 */
enum EntryRounding: int
{
    case Half = 0;
    case Quarter = 1;
    case Minute = 2;

    /**
     * Value a duration in minutes. A started increment is a billed increment,
     * so 1 h 07 counts as 1 h 15 at quarter-hour rounding.
     */
    public function valueMinutes(int $minutes): int
    {
        $step = match ($this) {
            self::Half => 30,
            self::Quarter => 15,
            self::Minute => 1,
        };

        return $this->startedSteps($minutes, $step) * $step;
    }

    /**
     * Value a duration as a fraction of a workday. At half-day rounding a
     * 3-hour morning counts as half a day and 5 hours count as a full one;
     * minute rounding values the fraction exactly.
     */
    public function valueDayFraction(int $minutes, int $workdayMinutes): float
    {
        [$numerator, $denominator] = $this->billedDayFraction($minutes, $workdayMinutes);

        return $numerator / $denominator;
    }

    /**
     * The same quantity as an exact fraction, as [numerator, denominator].
     *
     * A float is fine for display but cannot multiply a rate: money here is integer
     * minor units with one explicit rounding step, and 1/3 of a day has no float
     * representation to round from. Callers pricing tracked time use this instead.
     *
     * Capped at one day: a client is billed days, not overtime, so nine hours on a
     * seven-hour workday is still one day. The cap applies to whatever quantity the
     * caller measures — a single entry here, the day's summed minutes on the CRA —
     * so a day split across entries can still bill more than the CRA reports; see
     * MaterializeCraDays::grid() for why the two aggregate differently.
     *
     * @return array{int, int}
     */
    public function billedDayFraction(int $minutes, int $workdayMinutes): array
    {
        $stepsPerDay = match ($this) {
            self::Half => 2,
            self::Quarter => 4,
            self::Minute => null,
        };

        if ($stepsPerDay === null) {
            return [min($minutes, $workdayMinutes), $workdayMinutes];
        }

        return [
            min($this->startedSteps($minutes, (int) round($workdayMinutes / $stepsPerDay)), $stepsPerDay),
            $stepsPerDay,
        ];
    }

    private function startedSteps(int $minutes, int $stepInMinutes): int
    {
        return intdiv($minutes + $stepInMinutes - 1, $stepInMinutes);
    }
}
