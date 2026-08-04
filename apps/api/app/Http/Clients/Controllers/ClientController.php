<?php

declare(strict_types=1);

namespace App\Http\Clients\Controllers;

use App\Domain\Clients\Actions\ArchiveClient;
use App\Domain\Clients\Actions\CreateClient;
use App\Domain\Clients\Actions\DeleteClient;
use App\Domain\Clients\Actions\UnarchiveClient;
use App\Domain\Clients\Actions\UpdateClient;
use App\Domain\Clients\Data\ClientData;
use App\Domain\Clients\Data\ClientListData;
use App\Domain\Clients\Data\CreateClientData;
use App\Domain\Clients\Data\UpdateClientData;
use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ClientController extends Controller
{
    public function index(#[CurrentUser] User $user): JsonResponse
    {
        $clients = $user
            ->clients()
            ->orderBy('name')
            ->get();

        return response()->json(new ClientListData(
            clients: array_values(ClientData::collect($clients, 'array')),
        ));
    }

    public function store(CreateClientData $data, #[CurrentUser] User $user, CreateClient $createClient): JsonResponse
    {
        $client = $createClient->handle($user, $data);

        return response()->json(ClientData::from($client), 201);
    }

    public function update(UpdateClientData $data, Client $client, UpdateClient $updateClient): JsonResponse
    {
        $updateClient->handle($client, $data);

        return response()->json(ClientData::from($client));
    }

    public function archive(Client $client, ArchiveClient $archiveClient): JsonResponse
    {
        $archiveClient->handle($client);

        return response()->json(ClientData::from($client));
    }

    public function unarchive(Client $client, UnarchiveClient $unarchiveClient): JsonResponse
    {
        $unarchiveClient->handle($client);

        return response()->json(ClientData::from($client));
    }

    /**
     * @throws HttpException<409, 'Cannot delete a client that still has missions. Archive it instead.'>
     */
    public function destroy(Client $client, DeleteClient $deleteClient): Response
    {
        $deleteClient->handle($client);

        return response()->noContent();
    }
}
