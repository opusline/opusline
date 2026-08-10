<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class LockUserTimer
{
    public function __construct(private readonly FindRunningTimer $findRunningTimer) {}

    /**
     * @template TResult
     *
     * @param  callable(RunningTimer): TResult  $mutate
     * @return TResult
     */
    public function handle(User $user, callable $mutate): mixed
    {
        return DB::transaction(function () use ($user, $mutate) {
            User::query()->whereKey($user->getKey())->lockForUpdate()->firstOrFail();

            return $mutate($this->findRunningTimer->handleOrFail($user, forUpdate: true));
        });
    }
}
