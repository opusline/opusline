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
            'type' => $data->type,
            'notes' => $data->notes,
            'siret' => $data->siret,
            'vat_number' => $data->vatNumber,
            'billing_address_line1' => $data->billingAddressLine1,
            'billing_address_line2' => $data->billingAddressLine2,
            'billing_postal_code' => $data->billingPostalCode,
            'billing_city' => $data->billingCity,
            'billing_country' => $data->billingCountry,
            'billing_contact_name' => $data->billingContactName,
            'billing_email' => $data->billingEmail,
            'color' => $data->color,
            'payment_terms_days' => $data->paymentTermsDays,
        ]);
    }
}
