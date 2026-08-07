<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Actions;

use App\Domain\TimeEntries\Data\TimeEntryInputData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Illuminate\Validation\ValidationException;

class ValidateTimeEntry
{
    public function handle(User $user, TimeEntryInputData $data, ?TimeEntry $current = null): void
    {
        $siblings = $user->timeEntries()->where('date', $data->date);

        if ($current instanceof TimeEntry) {
            $siblings->whereKeyNot($current->getKey());
        }

        if ((int) $siblings->sum('duration_minutes') + $data->durationMinutes > TimeEntry::MINUTES_PER_DAY) {
            throw ValidationException::withMessages([
                'durationMinutes' => __('time-entries.duration_total_exceeded'),
            ]);
        }
    }
}
