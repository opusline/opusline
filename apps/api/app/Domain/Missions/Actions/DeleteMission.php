<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Missions\Models\Mission;

class DeleteMission
{
    public function handle(Mission $mission): void
    {
        // TODO(time-entries): abort 409 here once missions can carry time
        // entries — deleting tracked work must fail loud, like client deletion.
        $mission->delete();
    }
}
