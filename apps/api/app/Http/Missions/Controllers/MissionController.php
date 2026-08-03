<?php

declare(strict_types=1);

namespace App\Http\Missions\Controllers;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Actions\CreateMission;
use App\Domain\Missions\Actions\UpdateMission;
use App\Domain\Missions\Data\CreateMissionData;
use App\Domain\Missions\Data\MissionData;
use App\Domain\Missions\Data\UpdateMissionData;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MissionController extends Controller
{
    public function store(CreateMissionData $data, Request $request, int $client, CreateMission $createMission): JsonResponse
    {
        $user = $request->user() ?? abort(401);
        $billingClient = $this->clientById($request, $client);

        $mission = $createMission->handle($user, $billingClient, $data);

        return response()->json(MissionData::fromModel($mission), 201);
    }

    public function update(UpdateMissionData $data, Request $request, int $client, int $mission, UpdateMission $updateMission): JsonResponse
    {
        $missionModel = $this->clientById($request, $client)->missions()->findOrFail($mission);

        $updateMission->handle($missionModel, $data);

        return response()->json(MissionData::fromModel($missionModel));
    }

    public function destroy(Request $request, int $client, int $mission): Response
    {
        $missionModel = $this->clientById($request, $client)->missions()->findOrFail($mission);

        // TODO(time-entries): abort 409 here once missions can carry time
        // entries — deleting tracked work must fail loud, like client deletion.
        $missionModel->delete();

        return response()->noContent();
    }

    private function clientById(Request $request, int $clientId): Client
    {
        return ($request->user() ?? abort(401))
            ->clients()
            ->findOrFail($clientId);
    }
}
