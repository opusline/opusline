<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Actions;

use App\Domain\Cra\Calendar\Holidays;
use App\Domain\Cra\Models\CraDay;
use App\Domain\TimeEntries\Data\MonthWorkloadData;
use App\Domain\TimeEntries\Data\MonthWorkloadQueryData;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

class SummarizeMonthWorkload
{
    public function handle(User $user, MonthWorkloadQueryData $data): MonthWorkloadData
    {
        $settings = $user->settingsOrFail();
        $start = CarbonImmutable::parse($data->month.'-01')->startOfMonth();
        $end = $start->endOfMonth();

        return new MonthWorkloadData(
            month: $data->month,
            businessDays: $this->businessDays($settings->business_country, $start, $end),
            workedDayFractionBp: $this->workedDayFractionBp($user, $settings->workday_minutes, $start, $end),
        );
    }

    private function businessDays(string $businessCountry, CarbonImmutable $start, CarbonImmutable $end): int
    {
        $holidays = Holidays::for($businessCountry)->between($start, $end);
        $businessDays = 0;

        for ($date = $start; $date->lessThanOrEqualTo($end); $date = $date->addDay()) {
            if (! $date->isWeekend() && ! isset($holidays[$date->toDateString()])) {
                $businessDays++;
            }
        }

        return $businessDays;
    }

    private function workedDayFractionBp(User $user, int $workdayMinutes, CarbonImmutable $start, CarbonImmutable $end): int
    {
        $minutesByDate = [];

        $entries = $user->timeEntries()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->get(['date', 'duration_minutes']);

        foreach ($entries as $entry) {
            $key = $entry->date->toDateString();
            $minutesByDate[$key] = ($minutesByDate[$key] ?? 0) + $entry->duration_minutes;
        }

        $total = 0;

        foreach ($minutesByDate as $minutes) {
            // Capped per day: the tile measures how much of the month is behind
            // you, and a long day cannot buy back a day the calendar never had.
            $total += min(
                (int) round($minutes * CraDay::FULL_DAY_BP / $workdayMinutes),
                CraDay::FULL_DAY_BP,
            );
        }

        return $total;
    }
}
