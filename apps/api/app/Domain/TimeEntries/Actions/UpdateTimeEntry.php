<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Actions;

use App\Domain\TimeEntries\Data\TimeEntryInputData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateTimeEntry
{
    public function __construct(private readonly ValidateTimeEntry $validateTimeEntry) {}

    public function handle(User $user, TimeEntry $timeEntry, TimeEntryInputData $data): TimeEntry
    {
        return DB::transaction(function () use ($user, $timeEntry, $data): TimeEntry {
            $mission = $user->missions()->whereKey($data->missionId)->lockForUpdate()->firstOrFail();

            $this->validateTimeEntry->handle($mission, $data, $timeEntry);

            $timeEntry->update([
                'mission_id' => $mission->id,
                'date' => $data->date,
                'duration_minutes' => $data->durationMinutes,
                'note' => $data->note,
            ]);

            $timeEntry->setRelation('mission', $mission);

            return $timeEntry;
        });
    }
}
