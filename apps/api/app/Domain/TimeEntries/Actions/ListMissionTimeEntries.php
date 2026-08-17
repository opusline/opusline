<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Actions;

use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;

/**
 * Every entry tracked on one mission, newest first.
 *
 * Unlike the week grid's listing this takes no date range: the mission page
 * reads the mission's whole history, and one mission's entries are bounded by
 * the days actually worked on it.
 */
class ListMissionTimeEntries
{
    /**
     * @return array<int, TimeEntry>
     */
    public function handle(Mission $mission): array
    {
        return $mission->timeEntries()
            ->with('mission')
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get()
            ->all();
    }
}
