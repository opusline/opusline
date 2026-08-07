<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Missions\Models\Mission;
use Illuminate\Support\Facades\DB;

class DeleteMission
{
    public function handle(Mission $mission): void
    {
        DB::transaction(function () use ($mission): void {
            $locked = Mission::query()->whereKey($mission->getKey())->lockForUpdate()->firstOrFail();

            abort_if($locked->timeEntries()->exists(), 409, __('missions.cannot_delete_with_time_entries'));

            $locked->delete();
        });
    }
}
