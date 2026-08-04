<?php

declare(strict_types=1);

namespace App\Domain\Clients\Actions;

use App\Domain\Clients\Models\Client;

class DeleteClient
{
    public function handle(Client $client): void
    {
        abort_if($client->missions()->exists(), 409, __('clients.cannot_delete_with_missions'));

        $client->delete();
    }
}
