<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

class DiscardTimer
{
    public function __construct(private readonly LockUserTimer $lockUserTimer) {}

    public function handle(User $user): void
    {
        $this->lockUserTimer->handle($user, function (RunningTimer $timer): void {
            $timer->delete();
        });
    }
}
