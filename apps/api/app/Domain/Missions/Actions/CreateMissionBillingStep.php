<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Missions\Data\SaveMissionBillingStepData;
use App\Domain\Missions\Models\Mission;
use App\Domain\Missions\Models\MissionBillingStep;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

class CreateMissionBillingStep
{
    public function __construct(private readonly ValidateMissionBillingStep $validate) {}

    public function handle(User $user, Mission $mission, SaveMissionBillingStepData $data): MissionBillingStep
    {
        $this->validate->assertMissionCanSchedule($mission);

        return DB::transaction(function () use ($user, $mission, $data): MissionBillingStep {
            AccountCurrency::assertMatchesAccountUnderLock($mission->user_id, $data->amount);

            // Read under the same lock that serialises the write: two steps added
            // at once would otherwise both take the position the other is using.
            /** @var int|string|null $lastPosition */
            $lastPosition = $mission->billingSteps()->max('position');

            return $user->billingSteps()->create([
                'mission_id' => $mission->id,
                'label' => $data->label,
                'currency' => $data->amount->currency->value,
                'amount_cents' => $data->amount->toMoney(),
                'position' => $lastPosition === null ? 0 : (int) $lastPosition + 1,
                'due_on' => $data->dueOn,
            ]);
        });
    }
}
