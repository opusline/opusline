<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

class ResumeTimer
{
    public function __construct(private readonly LockUserTimer $lockUserTimer) {}

    public function handle(User $user): RunningTimer
    {
        return $this->lockUserTimer->handle($user, function (RunningTimer $timer): RunningTimer {
            if (! $timer->isPaused()) {
                return $timer;
            }

            $timer->update(['running_since' => now()]);

            return $timer;
        });
    }
}
