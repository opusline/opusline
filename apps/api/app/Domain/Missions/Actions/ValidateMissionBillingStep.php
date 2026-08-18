<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Models\Mission;
use App\Domain\Missions\Models\MissionBillingStep;
use Illuminate\Validation\ValidationException;

class ValidateMissionBillingStep
{
    /**
     * A schedule only means something against an agreed total. A mission billed
     * by the day has no price to split into instalments — what it bills is
     * whatever was worked — so a step there would be a number with no contract
     * behind it.
     */
    public function assertMissionCanSchedule(Mission $mission): void
    {
        if ($mission->billing_mode !== BillingMode::Fixed) {
            throw ValidationException::withMessages([
                'billingMode' => __('missions.schedule_forfait_only'),
            ]);
        }
    }

    /**
     * Once a step has been billed, its figures are part of an invoice's story.
     * Editing them would rewrite what the schedule says was billed while the
     * invoice keeps saying something else.
     */
    public function assertNotBilled(MissionBillingStep $step): void
    {
        if ($step->invoice_id !== null) {
            throw ValidationException::withMessages([
                'billingStepId' => __('missions.billing_step_already_invoiced'),
            ]);
        }
    }
}
