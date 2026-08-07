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
        $step = match ($this) {
            self::Half => 0.5,
            self::Quarter => 0.25,
            self::Minute => null,
        };

        if ($step === null) {
            return $minutes / $workdayMinutes;
        }

        return $this->startedSteps($minutes, (int) round($step * $workdayMinutes)) * $step;
    }

    private function startedSteps(int $minutes, int $stepInMinutes): int
    {
        return intdiv($minutes + $stepInMinutes - 1, $stepInMinutes);
    }
}
