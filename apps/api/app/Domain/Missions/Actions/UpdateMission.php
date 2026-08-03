<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Missions\Data\UpdateMissionData;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use Illuminate\Validation\ValidationException;

class UpdateMission
{
    public function handle(User $user, Mission $mission, UpdateMissionData $data): Mission
    {
        $endClient = $data->endClientSlug === null
            ? null
            : $user->clients()->where('slug', $data->endClientSlug)->firstOrFail();

        if ($endClient !== null && $endClient->id === $mission->client_id) {
            throw ValidationException::withMessages([
                'endClientSlug' => __('The end client must be different from the billing client.'),
            ]);
        }

        $mission->update([
            'end_client_id' => $endClient?->id,
            'name' => $data->name,
            'rate_cents' => $data->rate?->amount,
            'currency' => $data->rate->currency ?? 'EUR',
            'status' => $data->status,
            'start_date' => $data->startDate,
            'end_date' => $data->endDate,
        ]);

        return $mission;
    }
}
