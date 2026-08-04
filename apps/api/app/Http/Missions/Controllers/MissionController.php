<?php

declare(strict_types=1);

namespace App\Http\Missions\Controllers;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Actions\CreateMission;
use App\Domain\Missions\Actions\DeleteMission;
use App\Domain\Missions\Actions\UpdateMission;
use App\Domain\Missions\Data\CreateMissionData;
use App\Domain\Missions\Data\MissionData;
use App\Domain\Missions\Data\UpdateMissionData;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class MissionController extends Controller
{
    public function store(CreateMissionData $data, #[CurrentUser] User $user, Client $client, CreateMission $createMission): JsonResponse
    {
        $mission = $createMission->handle($user, $client, $data);

        return response()->json(MissionData::from($mission), 201);
    }

    public function update(UpdateMissionData $data, Client $client, Mission $mission, UpdateMission $updateMission): JsonResponse
    {
        $updateMission->handle($mission, $data);

        return response()->json(MissionData::from($mission));
    }

    public function destroy(Client $client, Mission $mission, DeleteMission $deleteMission): Response
    {
        $deleteMission->handle($mission);

        return response()->noContent();
    }
}
