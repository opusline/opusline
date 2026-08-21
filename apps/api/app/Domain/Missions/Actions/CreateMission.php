<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Data\CreateMissionData;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class CreateMission
{
    public function __construct(private readonly ValidateMission $validateMission) {}

    public function handle(User $user, Client $client, CreateMissionData $data): Mission
    {
        $this->validateMission->handle($client, $data);

        return DB::transaction(function () use ($user, $client, $data): Mission {
            foreach ([$data->rate, $data->referenceDailyRate] as $money) {
                if ($money instanceof MoneyData) {
                    AccountCurrency::assertMatchesAccountUnderLock($user->id, $money);
                }
            }

            return $user->missions()->create([
                'client_id' => $client->id,
                'name' => $data->name,
                'end_client_name' => $data->endClientName,
                'billing_mode' => $data->billingMode,
                'rate_cents' => $data->rate?->toMoney(),
                'reference_daily_rate_cents' => $data->referenceDailyRate?->toMoney(),
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
        });
    }
}
