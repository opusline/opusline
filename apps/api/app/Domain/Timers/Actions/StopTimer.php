<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\TimeEntries\Actions\CreateTimeEntry;
use App\Domain\TimeEntries\Data\TimeEntryInputData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Timers\Data\StopTimerData;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;
use Illuminate\Validation\ValidationException;

class StopTimer
{
    private const int MINUTES_PER_HALF_HOUR = 30;

    public function __construct(
        private readonly LockUserTimer $lockUserTimer,
        private readonly CreateTimeEntry $createTimeEntry,
    ) {}

    public function handle(User $user, StopTimerData $data): TimeEntry
    {
        return $this->lockUserTimer->handle($user, function (RunningTimer $timer) use ($user, $data): TimeEntry {
            $this->assertDurationWithinElapsed($user, $timer, $data->durationMinutes);

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

    /**
     * The timer is server-authoritative for the time it measured; the client may
     * correct downwards (a timer left running) or up to the next billing increment,
     * but never bill minutes the timer did not see.
     */
    private function assertDurationWithinElapsed(User $user, RunningTimer $timer, int $durationMinutes): void
    {
        $elapsedMinutes = max(1, (int) ceil($timer->elapsedSeconds() / 60));

        $stepMinutes = $timer->mission->billing_mode === BillingMode::Hourly
            ? self::MINUTES_PER_HALF_HOUR
            : (int) round($user->settingsOrFail()->workday_minutes / 2);

        $maxMinutes = intdiv($elapsedMinutes + $stepMinutes - 1, $stepMinutes) * $stepMinutes;

        if ($durationMinutes > $maxMinutes) {
            throw ValidationException::withMessages([
                'durationMinutes' => __('timers.duration_exceeds_elapsed'),
            ]);
        }
    }
}
