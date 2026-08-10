<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;

class FindRunningTimer
{
    public function handle(User $user, bool $forUpdate = false): ?RunningTimer
    {
        $query = $user->runningTimer();

        if ($forUpdate) {
            $query->lockForUpdate();
        }

        return $query->first();
    }

    public function handleOrFail(User $user, bool $forUpdate = false): RunningTimer
    {
        $timer = $this->handle($user, $forUpdate);

        if (! $timer instanceof RunningTimer) {
            abort(404, __('timers.not_running'));
        }

        return $timer;
    }
}
