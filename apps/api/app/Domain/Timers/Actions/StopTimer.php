<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\TimeEntries\Actions\CreateTimeEntry;
use App\Domain\TimeEntries\Data\TimeEntryInputData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Data\StopTimerData;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class StopTimer
{
    public function __construct(
        private readonly FindRunningTimer $findRunningTimer,
        private readonly CreateTimeEntry $createTimeEntry,
    ) {}

    public function handle(User $user, StopTimerData $data): TimeEntry
    {
        return DB::transaction(function () use ($user, $data): TimeEntry {
            User::query()->whereKey($user->getKey())->lockForUpdate()->firstOrFail();

            $timer = $this->findRunningTimer->handleOrFail($user, forUpdate: true);

            $timeEntry = $this->createTimeEntry->handle($user, new TimeEntryInputData(
                missionId: $timer->mission_id,
                date: $data->date,
                durationMinutes: $data->durationMinutes,
                billable: $data->billable,
                note: $data->note,
            ));

            $timer->delete();

            return $timeEntry;
        });
    }
}
