<?php

declare(strict_types=1);

namespace App\Http\Missions\Controllers;

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
    public function store(CreateMissionData $data, Request $request, CreateMission $createMission): JsonResponse
    {
        $mission = $createMission->handle($request->user() ?? abort(401), $data);

        return response()->json(MissionData::fromModel($mission->load(['client', 'endClient'])), 201);
    }

    public function update(UpdateMissionData $data, Request $request, int $missionId, UpdateMission $updateMission): JsonResponse
    {
        $user = $request->user() ?? abort(401);
        $mission = $user->missions()->findOrFail($missionId);

        $updateMission->handle($user, $mission, $data);

        return response()->json(MissionData::fromModel($mission->load(['client', 'endClient'])));
    }

    public function destroy(Request $request, int $missionId): Response
    {
        $mission = ($request->user() ?? abort(401))->missions()->findOrFail($missionId);

        // TODO(time-entries): abort 409 here once missions can carry time
        // entries — deleting tracked work must fail loud, like client deletion.
        $mission->delete();

        return response()->noContent();
    }
}
