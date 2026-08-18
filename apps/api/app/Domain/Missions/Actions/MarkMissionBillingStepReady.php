<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Missions\Models\MissionBillingStep;
use Carbon\CarbonImmutable;

/**
 * Flips whether the project event behind a step has happened.
 *
 * The date on a step is a forecast; this is the fact. Staging goes up when it
 * goes up, and that is the moment the instalment becomes billable.
 */
class MarkMissionBillingStepReady
{
    public function __construct(private readonly ValidateMissionBillingStep $validate) {}

    public function handle(MissionBillingStep $step, bool $isReady): MissionBillingStep
    {
        $this->validate->assertNotBilled($step);

        $step->update(['ready_at' => $isReady ? CarbonImmutable::now() : null]);

        return $step;
    }
}
