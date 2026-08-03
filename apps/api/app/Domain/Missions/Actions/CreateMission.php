<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Missions\Data\CreateMissionData;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

class CreateMission
{
    public function handle(User $user, CreateMissionData $data): Mission
    {
        $client = $user->clients()->where('slug', $data->clientSlug)->firstOrFail();
        $endClient = $data->endClientSlug === null
            ? null
            : $user->clients()->where('slug', $data->endClientSlug)->firstOrFail();

        return $user->missions()->create([
            'client_id' => $client->id,
            'end_client_id' => $endClient?->id,
            'name' => $data->name,
            'billing_mode' => $data->billingMode,
            'rate_cents' => $data->rate?->amount,
            'currency' => $data->rate->currency ?? 'EUR',
            'status' => MissionStatus::Active,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
        ]);
    }
}
