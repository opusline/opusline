<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Actions\SummarizeClientRevenue;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class ClientRevenueController extends Controller
{
    public function index(#[CurrentUser] User $user, SummarizeClientRevenue $summarizeClientRevenue): JsonResponse
    {
        return response()->json($summarizeClientRevenue->handle($user));
    }

    public function show(#[CurrentUser] User $user, Client $client, SummarizeClientRevenue $summarizeClientRevenue): JsonResponse
    {
        return response()->json($summarizeClientRevenue->forOneClient($user, $client));
    }

    /**
     * $client is unused but load-bearing: the implicit binding resolves it, and
     * the route's scopeBindings() then resolves the mission off its missions().
     */
    public function showMission(
        #[CurrentUser] User $user,
        Client $client,
        Mission $mission,
        SummarizeClientRevenue $summarizeClientRevenue,
    ): JsonResponse {
        return response()->json($summarizeClientRevenue->forOneMission($user, $mission));
    }
}
