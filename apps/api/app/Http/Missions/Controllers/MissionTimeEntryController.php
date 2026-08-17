<?php

declare(strict_types=1);

namespace App\Http\Missions\Controllers;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Actions\ListMissionTimeEntries;
use App\Domain\TimeEntries\Data\TimeEntryData;
use App\Domain\TimeEntries\Data\TimeEntryListData;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class MissionTimeEntryController extends Controller
{
    public function index(Client $client, Mission $mission, ListMissionTimeEntries $listMissionTimeEntries): JsonResponse
    {
        $timeEntries = $listMissionTimeEntries->handle($mission);

        return response()->json(new TimeEntryListData(
            timeEntries: array_values(TimeEntryData::collect($timeEntries, 'array')),
        ));
    }
}
