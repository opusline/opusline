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
            'type' => $data->type,
            'notes' => $data->notes,
            'siret' => $data->siret,
            'vat_number' => $data->vatNumber,
            'billing_address' => $data->billingAddress,
            'billing_contact_name' => $data->billingContactName,
            'billing_email' => $data->billingEmail,
            'color' => $data->color,
            'payment_terms_days' => $data->paymentTermsDays,
        ]);

        return $client;
    }
}
