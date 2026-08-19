<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\Timers\Data\StartTimerData;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;

class StartTimer
{
    public function handle(User $user, StartTimerData $data): RunningTimer
    {
        return DB::transaction(function () use ($user, $data): RunningTimer {
            User::lockRow($user->id);

            abort_if($user->runningTimer()->exists(), 409, __('timers.already_running'));

            $mission = $user->missions()->whereKey($data->missionId)->firstOrFail();

            $startedAt = now();

            try {
                $timer = $user->runningTimer()->create([
                    'mission_id' => $mission->id,
                    'started_at' => $startedAt,
                    'running_since' => $startedAt,
                    'accumulated_seconds' => 0,
                    'note' => null,
                ]);
            } catch (UniqueConstraintViolationException) {
                abort(409, __('timers.already_running'));
            }

            $timer->setRelation('mission', $mission);

            return $timer;
        });
    }
}
