<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Data\CreateMissionData;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use Illuminate\Validation\ValidationException;

class CreateMission
{
    public function handle(User $user, Client $client, CreateMissionData $data): Mission
    {
        if ($data->endClientId !== null && $data->endClientId === $client->id) {
            throw ValidationException::withMessages([
                'endClientId' => __('missions.end_client_must_differ'),
            ]);
        }

        return $user->missions()->create([
            'client_id' => $client->id,
            'end_client_id' => $data->endClientId,
            'name' => $data->name,
            'billing_mode' => $data->billingMode,
            'rate_cents' => $data->rate?->toMoney(),
            'status' => MissionStatus::Active,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
        ]);
    }
}
