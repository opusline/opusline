<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Data\UpdateMissionData;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateMission
{
    public function __construct(private readonly ValidateMission $validateMission) {}

    public function handle(Client $client, Mission $mission, UpdateMissionData $data): Mission
    {
        return DB::transaction(function () use ($client, $mission, $data): Mission {
            // Same user-row lock as CreateTimeEntry, taken before validating:
            // otherwise a concurrent first entry could land between the
            // billing-mode immutability check and the write.
            User::lockRow($mission->user_id);

            $this->validateMission->handle($client, $data, $mission);

            if ($data->rate instanceof MoneyData) {
                AccountCurrency::assertMatchesAccountUnderLock($mission->user_id, $data->rate);
            }

            $mission->update([
                'name' => $data->name,
                'end_client_name' => $data->endClientName,
                'billing_mode' => $data->billingMode,
                'rate_cents' => $data->rate?->toMoney(),
                'rounding' => $data->billingMode->resolveRounding($data->rounding),
                'status' => $data->status,
                'cra_required' => $data->billingMode->resolveCraRequired(
                    $data->craRequired,
                    $client->type->requiresCraByDefault(),
                ),
                'color' => $data->color,
                'notes' => $data->notes,
                'start_date' => $data->startDate,
                'end_date' => $data->endDate,
            ]);

            return $mission;
        });
    }
}
