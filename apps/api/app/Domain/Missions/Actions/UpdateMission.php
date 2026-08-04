<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Data\UpdateMissionData;
use App\Domain\Missions\Models\Mission;

class UpdateMission
{
    public function __construct(private readonly ValidateMission $validateMission) {}

    public function handle(Client $client, Mission $mission, UpdateMissionData $data): Mission
    {
        $this->validateMission->handle($client, $data);

        $mission->update([
            'name' => $data->name,
            'end_client_name' => $data->endClientName,
            'billing_mode' => $data->billingMode,
            'rate_cents' => $data->rate?->toMoney(),
            'rounding' => $data->billingMode->resolveRounding($data->rounding),
            'status' => $data->status,
            'cra_required' => $data->craRequired ?? $client->type->requiresCraByDefault(),
            'color' => $data->color,
            'notes' => $data->notes,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
        ]);

        return $mission;
    }
}
