<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\TimeEntries\Actions\CreateTimeEntry;
use App\Domain\TimeEntries\Data\TimeEntryInputData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Data\StopTimerData;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

class StopTimer
{
    public function __construct(
        private readonly LockUserTimer $lockUserTimer,
        private readonly CreateTimeEntry $createTimeEntry,
    ) {}

    public function handle(User $user, StopTimerData $data): TimeEntry
    {
        return $this->lockUserTimer->handle($user, function (RunningTimer $timer) use ($user, $data): TimeEntry {
            $timeEntry = $this->createTimeEntry->handle($user, new TimeEntryInputData(
                missionId: $timer->mission_id,
                date: $data->date,
                durationMinutes: $data->durationMinutes,
                rounding: $data->rounding,
                billable: $data->billable,
                note: $data->note,
            ));

            $timer->delete();

            return $timeEntry;
        });
    }
}
