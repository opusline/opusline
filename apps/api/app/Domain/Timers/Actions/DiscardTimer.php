<?php

declare(strict_types=1);

namespace App\Domain\Timers\Actions;

use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class DiscardTimer
{
    public function __construct(private readonly FindRunningTimer $findRunningTimer) {}

    public function handle(User $user): void
    {
        DB::transaction(function () use ($user): void {
            User::query()->whereKey($user->getKey())->lockForUpdate()->firstOrFail();

            $this->findRunningTimer->handleOrFail($user, forUpdate: true)->delete();
        });
    }
}
