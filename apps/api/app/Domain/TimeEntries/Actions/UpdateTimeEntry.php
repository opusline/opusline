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
            User::lockRow($user->id);

            $mission = $user->missions()->whereKey($data->missionId)->firstOrFail();

            abort_if(
                $timeEntry->isInvoiced() && $this->changesBilling($timeEntry, $mission->id, $data),
                409,
                __('invoices.cannot_change_invoiced_time_entry'),
            );

            $this->validateTimeEntry->handle($user, $data, $timeEntry);

            $timeEntry->update([
                'mission_id' => $mission->id,
                'date' => $data->date,
                'duration_minutes' => $data->durationMinutes,
                'rounding' => $data->rounding,
                'billable' => $data->billable,
                'note' => $data->note,
            ]);

            $timeEntry->setRelation('mission', $mission);

            return $timeEntry;
        });
    }

    /**
     * Everything an invoice's amount was derived from. The note is not among them, so
     * annotating already-billed time stays allowed.
     */
    private function changesBilling(TimeEntry $timeEntry, int $missionId, TimeEntryInputData $data): bool
    {
        $billed = [
            $timeEntry->mission_id,
            $timeEntry->date->toDateString(),
            $timeEntry->duration_minutes,
            $timeEntry->rounding,
            $timeEntry->billable,
        ];

        return $billed !== [
            $missionId,
            $data->date,
            $data->durationMinutes,
            $data->rounding,
            $data->billable,
        ];
    }
}
