<?php

declare(strict_types=1);

namespace App\Domain\Clients\Actions;

use App\Domain\Clients\Models\Client;

class UnarchiveClient
{
    public function handle(Client $client): Client
    {
        $client->update(['archived_at' => null]);

        return $client;
    }
}
