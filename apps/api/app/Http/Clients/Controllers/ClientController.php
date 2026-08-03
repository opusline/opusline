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
                    ->map(fn (Client $client): ClientData => ClientData::fromModel($client))
                    ->all(),
            ),
        ));
    }

    public function store(CreateClientData $data, Request $request, CreateClient $createClient): JsonResponse
    {
        $client = $createClient->handle($request->user() ?? abort(401), $data);

        return response()->json(ClientData::fromModel($client->load('missions')), 201);
    }

    public function update(UpdateClientData $data, Request $request, int $client, UpdateClient $updateClient): JsonResponse
    {
        $clientModel = ($request->user() ?? abort(401))->clientById($client);

        $updateClient->handle($clientModel, $data);

        return response()->json(ClientData::fromModel($clientModel->load('missions')));
    }

    public function archive(Request $request, int $client): JsonResponse
    {
        $clientModel = ($request->user() ?? abort(401))->clientById($client);

        $clientModel->update(['archived_at' => now()]);

        return response()->json(ClientData::fromModel($clientModel->load('missions')));
    }

    public function unarchive(Request $request, int $client): JsonResponse
    {
        $clientModel = ($request->user() ?? abort(401))->clientById($client);

        $clientModel->update(['archived_at' => null]);

        return response()->json(ClientData::fromModel($clientModel->load('missions')));
    }

    public function destroy(Request $request, int $client): Response
    {
        $clientModel = ($request->user() ?? abort(401))->clientById($client);

        $hasMissions = Mission::query()->involvingClient($clientModel)->exists();

        abort_if($hasMissions, 409, __('clients.cannot_delete_with_missions'));

        $clientModel->delete();

        return response()->noContent();
    }
}
