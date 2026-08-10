<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\Timers\Data\UpdateTimerData;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

class UpdateTimerNote
{
    public function __construct(private readonly LockUserTimer $lockUserTimer) {}

    public function handle(User $user, UpdateTimerData $data): RunningTimer
    {
        return $this->lockUserTimer->handle($user, function (RunningTimer $timer) use ($data): RunningTimer {
            $timer->update(['note' => $data->note]);

            return $timer;
        });
    }
}
