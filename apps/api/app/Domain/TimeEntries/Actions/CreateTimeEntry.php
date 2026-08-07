<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Actions;

use App\Domain\TimeEntries\Data\TimeEntryInputData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class CreateTimeEntry
{
    public function __construct(private readonly ValidateTimeEntry $validateTimeEntry) {}

    public function handle(User $user, TimeEntryInputData $data): TimeEntry
    {
        return DB::transaction(function () use ($user, $data): TimeEntry {
            User::query()->whereKey($user->getKey())->lockForUpdate()->firstOrFail();

            $mission = $user->missions()->whereKey($data->missionId)->firstOrFail();

            $this->validateTimeEntry->handle($user, $data);

            $timeEntry = $user->timeEntries()->create([
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
