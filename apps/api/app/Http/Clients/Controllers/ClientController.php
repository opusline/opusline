<?php

declare(strict_types=1);

namespace App\Http\Clients\Controllers;

use App\Domain\Clients\Actions\CreateClient;
use App\Domain\Clients\Actions\UpdateClient;
use App\Domain\Clients\Data\ClientData;
use App\Domain\Clients\Data\ClientListData;
use App\Domain\Clients\Data\CreateClientData;
use App\Domain\Clients\Data\UpdateClientData;
use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ClientController extends Controller
{
    private const array MISSION_RELATIONS = ['missions.client', 'missions.endClient'];

    public function index(Request $request): JsonResponse
    {
        $clients = ($request->user() ?? abort(401))
            ->clients()
            ->with(self::MISSION_RELATIONS)
            ->orderBy('name')
            ->get();

        return response()->json(new ClientListData(
            clients: array_values(
                $clients
                    ->map(fn (Client $client): ClientData => ClientData::fromModel($client))
                    ->all(),
            ),
        ));
    }

    public function store(CreateClientData $data, Request $request, CreateClient $createClient): JsonResponse
    {
        $client = $createClient->handle($request->user() ?? abort(401), $data);

        return response()->json(ClientData::fromModel($client->load(self::MISSION_RELATIONS)), 201);
    }

    public function update(UpdateClientData $data, Request $request, string $clientSlug, UpdateClient $updateClient): JsonResponse
    {
        $client = $this->clientBySlug($request, $clientSlug);

        $updateClient->handle($client, $data);

        return response()->json(ClientData::fromModel($client->load(self::MISSION_RELATIONS)));
    }

    public function archive(Request $request, string $clientSlug): JsonResponse
    {
        $client = $this->clientBySlug($request, $clientSlug);

        $client->update(['archived_at' => now()]);

        return response()->json(ClientData::fromModel($client->load(self::MISSION_RELATIONS)));
    }

    public function unarchive(Request $request, string $clientSlug): JsonResponse
    {
        $client = $this->clientBySlug($request, $clientSlug);

        $client->update(['archived_at' => null]);

        return response()->json(ClientData::fromModel($client->load(self::MISSION_RELATIONS)));
    }

    public function destroy(Request $request, string $clientSlug): Response
    {
        $client = $this->clientBySlug($request, $clientSlug);

        $hasMissions = Mission::query()
            ->where('client_id', $client->id)
            ->orWhere('end_client_id', $client->id)
            ->exists();

        abort_if($hasMissions, 409, 'Cannot delete a client that still has missions. Archive it instead.');

        $client->delete();

        return response()->noContent();
    }

    private function clientBySlug(Request $request, string $clientSlug): Client
    {
        return ($request->user() ?? abort(401))
            ->clients()
            ->where('slug', $clientSlug)
            ->firstOrFail();
    }
}
