<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Missions\Data\UpdateMissionData;
use App\Domain\Missions\Models\Mission;
use Illuminate\Validation\ValidationException;

class UpdateMission
{
    public function handle(Mission $mission, UpdateMissionData $data): Mission
    {
        if ($data->endClientId !== null && $data->endClientId === $mission->client_id) {
            throw ValidationException::withMessages([
                'endClientId' => __('missions.end_client_must_differ'),
            ]);
        }

        $mission->update([
            'end_client_id' => $data->endClientId,
            'name' => $data->name,
            'rate_cents' => $data->rate?->toMoney(),
            'status' => $data->status,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
        ]);

        return $mission;
    }
}
