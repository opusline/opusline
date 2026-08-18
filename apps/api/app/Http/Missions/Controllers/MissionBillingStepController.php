<?php

declare(strict_types=1);

namespace App\Http\Missions\Controllers;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Actions\CreateMissionBillingStep;
use App\Domain\Missions\Actions\DeleteMissionBillingStep;
use App\Domain\Missions\Actions\MarkMissionBillingStepReady;
use App\Domain\Missions\Data\MarkBillingStepReadyData;
use App\Domain\Missions\Data\MissionBillingStepData;
use App\Domain\Missions\Data\MissionBillingStepListData;
use App\Domain\Missions\Data\SaveMissionBillingStepData;
use App\Domain\Missions\Models\Mission;
use App\Domain\Missions\Models\MissionBillingStep;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Cknow\Money\Money;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class MissionBillingStepController extends Controller
{
    public function index(Client $client, Mission $mission): JsonResponse
    {
        return response()->json($this->listFor($mission));
    }

    public function store(
        SaveMissionBillingStepData $data,
        #[CurrentUser] User $user,
        Client $client,
        Mission $mission,
        CreateMissionBillingStep $createStep,
    ): JsonResponse {
        $createStep->handle($user, $mission, $data);

        return response()->json($this->listFor($mission->refresh()), 201);
    }

    public function ready(
        MarkBillingStepReadyData $data,
        Client $client,
        Mission $mission,
        MissionBillingStep $billingStep,
        MarkMissionBillingStepReady $markReady,
    ): JsonResponse {
        $markReady->handle($billingStep, $data->isReady);

        return response()->json($this->listFor($mission->refresh()));
    }

    public function destroy(
        Client $client,
        Mission $mission,
        MissionBillingStep $billingStep,
        DeleteMissionBillingStep $deleteStep,
    ): Response {
        $deleteStep->handle($billingStep);

        return response()->noContent();
    }

    /**
     * The whole schedule comes back from every write: the rows are few, they are
     * always read together, and a client that re-fetches cannot show a total that
     * disagrees with the steps it is drawn from.
     */
    private function listFor(Mission $mission): MissionBillingStepListData
    {
        $steps = $mission->billingSteps()->with('invoice:id,status')->get();

        /** @var list<MissionBillingStepData> $rows */
        $rows = $steps->map(MissionBillingStepData::fromModel(...))->values()->all();
        $scheduled = new Money(0, $mission->currency);

        foreach ($steps as $step) {
            $scheduled = $scheduled->add($step->amount_cents);
        }

        return new MissionBillingStepListData(
            steps: $rows,
            scheduled: MoneyData::fromMoney($scheduled),
        );
    }
}
