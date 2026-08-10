<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class DeleteMission
{
    public function handle(Mission $mission): void
    {
        DB::transaction(function () use ($mission): void {
            User::query()->whereKey($mission->user_id)->lockForUpdate()->firstOrFail();

            abort_if($mission->timeEntries()->exists(), 409, __('missions.cannot_delete_with_time_entries'));

            abort_if($mission->runningTimer()->exists(), 409, __('missions.cannot_delete_with_running_timer'));

            $mission->delete();
        });
    }
}
