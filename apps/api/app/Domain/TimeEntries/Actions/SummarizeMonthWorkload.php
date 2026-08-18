<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Actions;

use App\Domain\Cra\Calendar\Holidays;
use App\Domain\TimeEntries\Data\MonthWorkloadData;
use App\Domain\TimeEntries\Data\MonthWorkloadQueryData;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection as SupportCollection;

class SummarizeMonthWorkload
{
    public function handle(User $user, MonthWorkloadQueryData $data): MonthWorkloadData
    {
        $settings = $user->settingsOrFail();
        $start = CarbonImmutable::parse($data->month.'-01');
        $end = $start->endOfMonth();

        return new MonthWorkloadData(
            month: $data->month,
            businessDays: Holidays::businessDaysBetween($settings->business_country, $start, $end),
            workedDays: $this->workedDays($user, $settings->workday_minutes, $start, $end),
        );
    }

    private function workedDays(User $user, int $workdayMinutes, CarbonImmutable $start, CarbonImmutable $end): float
    {
        // Aggregated in SQL rather than hydrated: this runs on every week-view mount
        // and again after every time-entry write, and only the per-day total matters.
        /** @var SupportCollection<int, object{date: string, minutes: int|numeric-string}> $rows */
        $rows = $user->timeEntries()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->toBase()
            ->selectRaw('date, SUM(duration_minutes) as minutes')
            ->groupBy('date')
            ->get();

        $days = 0.0;

        foreach ($rows as $row) {
            // Capped per day: the tile measures how much of the month is behind you,
            // and a long day cannot buy back a day the calendar never had.
            $days += min((int) $row->minutes / $workdayMinutes, 1.0);
        }

        return round($days, 4);
    }
}
