<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Data\CreateMissionData;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

class CreateMission
{
    public function __construct(private readonly ValidateMission $validateMission) {}

    public function handle(User $user, Client $client, CreateMissionData $data): Mission
    {
        $this->validateMission->handle($client, $data);

        return $user->missions()->create([
            'client_id' => $client->id,
            'name' => $data->name,
            'end_client_name' => $data->endClientName,
            'billing_mode' => $data->billingMode,
            'rate_cents' => $data->rate?->toMoney(),
            'rounding' => $data->billingMode->resolveRounding($data->rounding),
            'status' => MissionStatus::Active,
            'cra_required' => $data->billingMode->resolveCraRequired(
                $data->craRequired,
                $client->type->requiresCraByDefault(),
            ),
            'color' => $data->color,
            'notes' => $data->notes,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
        ]);
    }
}
