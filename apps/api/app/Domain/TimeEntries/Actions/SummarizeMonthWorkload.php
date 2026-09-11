<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Actions;

use App\Domain\Cra\Calendar\Holidays;
use App\Domain\TimeEntries\Data\MonthWorkloadData;
use App\Domain\TimeEntries\Data\MonthWorkloadQueryData;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

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
            workedDays: $this->workedDays($user, $start, $end),
        );
    }

    /**
     * The days of the month that carry any tracked time at all.
     *
     * Whole days, not the fraction of a workday each one holds: the tile answers
     * "how many days of this month are behind me", and a day spent on the job is
     * behind you whether it ran four hours or nine.
     */
    private function workedDays(User $user, CarbonImmutable $start, CarbonImmutable $end): int
    {
        // Counted in SQL rather than hydrated: this runs on every week-view mount
        // and again after every time-entry write, and only the distinct dates matter.
        return $user->timeEntries()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->where('duration_minutes', '>', 0)
            ->distinct()
            ->count('date');
    }
}
