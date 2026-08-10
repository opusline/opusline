<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\Timers\Data\TrimTimerData;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class TrimTimer
{
    public function __construct(private readonly FindRunningTimer $findRunningTimer) {}

    public function handle(User $user, TrimTimerData $data): RunningTimer
    {
        return DB::transaction(function () use ($user, $data): RunningTimer {
            User::query()->whereKey($user->getKey())->lockForUpdate()->firstOrFail();

            $timer = $this->findRunningTimer->handleOrFail($user, forUpdate: true);

            $trimmed = max(0, $timer->elapsedSeconds() - $data->seconds);

            $timer->update([
                'accumulated_seconds' => $trimmed,
                'running_since' => $timer->isPaused() ? null : now(),
            ]);

            return $timer;
        });
    }
}
