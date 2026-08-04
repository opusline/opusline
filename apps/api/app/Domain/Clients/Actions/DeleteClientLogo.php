<?php

declare(strict_types=1);

namespace App\Domain\Clients\Actions;

use App\Domain\Clients\Models\Client;

class DeleteClientLogo
{
    public function handle(Client $client): void
    {
        $client->clearMediaCollection('logo');
    }
}
