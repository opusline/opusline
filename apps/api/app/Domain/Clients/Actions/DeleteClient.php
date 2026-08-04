<?php

declare(strict_types=1);

namespace App\Domain\Clients\Actions;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;

class DeleteClient
{
    public function handle(Client $client): void
    {
        $hasMissions = Mission::query()->involvingClient($client)->exists();

        abort_if($hasMissions, 409, __('clients.cannot_delete_with_missions'));

        $client->delete();
    }
}
