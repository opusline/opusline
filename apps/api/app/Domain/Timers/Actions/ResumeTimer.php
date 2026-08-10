<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class ResumeTimer
{
    public function __construct(private readonly FindRunningTimer $findRunningTimer) {}

    public function handle(User $user): RunningTimer
    {
        return DB::transaction(function () use ($user): RunningTimer {
            User::query()->whereKey($user->getKey())->lockForUpdate()->firstOrFail();

            $timer = $this->findRunningTimer->handleOrFail($user, forUpdate: true);

            if (! $timer->isPaused()) {
                return $timer;
            }

            $timer->update(['running_since' => now()]);

            return $timer;
        });
    }
}
