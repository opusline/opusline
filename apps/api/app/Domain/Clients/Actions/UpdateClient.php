<?php

declare(strict_types=1);

namespace App\Domain\Clients\Actions;

use App\Domain\Clients\Data\UpdateClientData;
use App\Domain\Clients\Models\Client;

class UpdateClient
{
    public function handle(Client $client, UpdateClientData $data): Client
    {
        $client->update([
            'name' => $data->name,
            'notes' => $data->notes,
        ]);

        return $client;
    }
}
