<?php

declare(strict_types=1);

namespace App\Domain\Clients\Actions;

use App\Domain\Clients\Data\UploadClientLogoData;
use App\Domain\Clients\Models\Client;

class UploadClientLogo
{
    public function handle(Client $client, UploadClientLogoData $data): void
    {
        $client->addMedia($data->logo)->toMediaCollection('logo');
    }
}
