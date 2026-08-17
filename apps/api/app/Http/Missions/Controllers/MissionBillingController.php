<?php

declare(strict_types=1);

namespace App\Http\Missions\Controllers;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Actions\SummarizeMissionBilling;
use App\Domain\Missions\Models\Mission;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class MissionBillingController extends Controller
{
    /**
     * Answers null for a mission billed by the day or the hour: there is no
     * agreed total to measure progress against, and a zero would read as
     * "nothing billed" rather than "not applicable".
     */
    public function show(Client $client, Mission $mission, SummarizeMissionBilling $summarizeMissionBilling): JsonResponse
    {
        return response()->json($summarizeMissionBilling->handle($mission));
    }
}
