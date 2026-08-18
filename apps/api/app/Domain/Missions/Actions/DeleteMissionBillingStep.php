<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Missions\Models\MissionBillingStep;

class DeleteMissionBillingStep
{
    public function __construct(private readonly ValidateMissionBillingStep $validate) {}

    public function handle(MissionBillingStep $step): void
    {
        $this->validate->assertNotBilled($step);

        $step->delete();
    }
}
