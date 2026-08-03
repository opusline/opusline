<?php

declare(strict_types=1);

namespace App\Domain\Clients\Actions;

use App\Domain\Clients\Data\CreateClientData;
use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;

class CreateClient
{
    public function handle(User $user, CreateClientData $data): Client
    {
        return $user->clients()->create([
            'name' => $data->name,
            'notes' => $data->notes,
        ]);
    }
}
