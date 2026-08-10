<?php

declare(strict_types=1);

namespace App\Http\TimeEntries\Controllers;

use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Actions\CreateTimeEntry;
use App\Domain\TimeEntries\Actions\DeleteTimeEntry;
use App\Domain\TimeEntries\Actions\ListTimeEntries;
use App\Domain\TimeEntries\Actions\UpdateTimeEntry;
use App\Domain\TimeEntries\Data\ListTimeEntriesData;
use App\Domain\TimeEntries\Data\TimeEntryData;
use App\Domain\TimeEntries\Data\TimeEntryInputData;
use App\Domain\TimeEntries\Data\TimeEntryListData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class TimeEntryController extends Controller
{
    public function index(ListTimeEntriesData $data, #[CurrentUser] User $user, ListTimeEntries $listTimeEntries): JsonResponse
    {
        $timeEntries = $listTimeEntries->handle($user, $data);

        return response()->json(new TimeEntryListData(
            timeEntries: array_values(TimeEntryData::collect($timeEntries, 'array')),
        ));
    }

    /**
     * @throws ModelNotFoundException<Mission>
     */
    public function store(TimeEntryInputData $data, #[CurrentUser] User $user, CreateTimeEntry $createTimeEntry): JsonResponse
    {
        $timeEntry = $createTimeEntry->handle($user, $data);

        return response()->json(TimeEntryData::from($timeEntry), 201);
    }

    public function update(TimeEntryInputData $data, #[CurrentUser] User $user, TimeEntry $timeEntry, UpdateTimeEntry $updateTimeEntry): JsonResponse
    {
        $updateTimeEntry->handle($user, $timeEntry, $data);

        return response()->json(TimeEntryData::from($timeEntry));
    }

    public function destroy(TimeEntry $timeEntry, DeleteTimeEntry $deleteTimeEntry): Response
    {
        $deleteTimeEntry->handle($timeEntry);

        return response()->noContent();
    }
}
