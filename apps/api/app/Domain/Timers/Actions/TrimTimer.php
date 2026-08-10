<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\Timers\Data\TrimTimerData;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

class TrimTimer
{
    public function __construct(private readonly LockUserTimer $lockUserTimer) {}

    public function handle(User $user, TrimTimerData $data): RunningTimer
    {
        return $this->lockUserTimer->handle($user, function (RunningTimer $timer) use ($data): RunningTimer {
            $timer->update([
                'accumulated_seconds' => max(0, $timer->elapsedSeconds() - $data->seconds),
                'running_since' => $timer->isPaused() ? null : now(),
            ]);

            return $timer;
        });
    }
}
