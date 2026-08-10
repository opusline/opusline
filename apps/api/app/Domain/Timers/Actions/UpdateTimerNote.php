<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\Timers\Data\UpdateTimerData;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateTimerNote
{
    public function __construct(private readonly FindRunningTimer $findRunningTimer) {}

    public function handle(User $user, UpdateTimerData $data): RunningTimer
    {
        return DB::transaction(function () use ($user, $data): RunningTimer {
            User::query()->whereKey($user->getKey())->lockForUpdate()->firstOrFail();

            $timer = $this->findRunningTimer->handleOrFail($user, forUpdate: true);

            $timer->update(['note' => $data->note]);

            return $timer;
        });
    }
}
