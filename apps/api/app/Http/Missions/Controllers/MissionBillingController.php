<?php

declare(strict_types=1);

namespace App\Http\Missions\Controllers;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Actions\SummarizeMissionBilling;
use App\Domain\Invoices\Data\MissionBillingProgressData;
use App\Domain\Missions\Models\Mission;
use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Response;
use Illuminate\Http\JsonResponse;

class MissionBillingController extends Controller
{
    /**
     * Answers null for a mission billed by the day or the hour: there is no
     * agreed total to measure progress against, and a zero would read as
     * "nothing billed" rather than "not applicable".
     */
    // Spelled out because the null branch hands Scramble a raw JSON string it
    // cannot infer a shape from.
    #[Response(type: 'MissionBillingProgressData|null')]
    public function show(Client $client, Mission $mission, SummarizeMissionBilling $summarizeMissionBilling): JsonResponse
    {
        $progress = $summarizeMissionBilling->handle($mission);

        if (! $progress instanceof MissionBillingProgressData) {
            // response()->json(null) writes `{}`, which the client reads as a
            // forfait whose figures are all missing — it must be a literal null.
            return JsonResponse::fromJsonString('null');
        }

        return response()->json($progress);
    }
}
