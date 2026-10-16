<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\SuperPdp;

use App\Domain\EInvoicing\Models\EInvoicingConnection;

/** The OAuth2 client credentials of the account's own Super PDP application. */
final readonly class SuperPdpCredentials
{
    public function __construct(
        public string $clientId,
        public string $clientSecret,
    ) {}

    public static function of(EInvoicingConnection $connection): self
    {
        return new self($connection->client_id, $connection->client_secret);
    }
}
