<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Actions;

use App\Domain\TimeEntries\Data\ListTimeEntriesData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Validation\ValidationException;

class ListTimeEntries
{
    private const int MAX_RANGE_DAYS = 366;

    /**
     * @return array<int, TimeEntry>
     */
    public function handle(User $user, ListTimeEntriesData $data): array
    {
        $from = CarbonImmutable::parse($data->from);
        $to = CarbonImmutable::parse($data->to);

        if ((int) $from->diffInDays($to) > self::MAX_RANGE_DAYS) {
            throw ValidationException::withMessages([
                'to' => __('time-entries.range_too_wide', ['days' => self::MAX_RANGE_DAYS]),
            ]);
        }

        return $user->timeEntries()
            ->with('mission')
            ->whereBetween('date', [$data->from, $data->to])
            ->orderBy('date')
            ->orderBy('id')
            ->get()
            ->all();
    }
}
