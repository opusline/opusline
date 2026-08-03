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
    public function index(Request $request): JsonResponse
    {
        $clients = ($request->user() ?? abort(401))
            ->clients()
            ->with('missions')
            ->orderBy('name')
            ->get();

        return response()->json(new ClientListData(
            clients: array_values(
                $clients
                    ->map(fn (Client $client): ClientData => ClientData::from($client))
                    ->all(),
            ),
        ));
    }

    public function store(CreateClientData $data, Request $request, CreateClient $createClient): JsonResponse
    {
        $client = $createClient->handle($request->user() ?? abort(401), $data);

        return response()->json(ClientData::from($client->load('missions')), 201);
    }

    public function update(UpdateClientData $data, Client $client, UpdateClient $updateClient): JsonResponse
    {
        $updateClient->handle($client, $data);

        return response()->json(ClientData::from($client->load('missions')));
    }

    public function archive(Client $client): JsonResponse
    {
        $client->update(['archived_at' => now()]);

        return response()->json(ClientData::from($client->load('missions')));
    }

    public function unarchive(Client $client): JsonResponse
    {
        $client->update(['archived_at' => null]);

        return response()->json(ClientData::from($client->load('missions')));
    }

    public function destroy(Client $client): Response
    {
        $hasMissions = Mission::query()->involvingClient($client)->exists();

        abort_if($hasMissions, 409, __('clients.cannot_delete_with_missions'));

        $client->delete();

        return response()->noContent();
    }
}
