<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\SuperPdp;

use App\Domain\EInvoicing\Enums\EInvoicingError;
use App\Domain\EInvoicing\Models\EInvoicingConnection;
use App\Domain\EInvoicing\Platform\EInvoicingPlatformException;

/** The OAuth2 client credentials of the account's own Super PDP application. */
final readonly class SuperPdpCredentials
{
    public function __construct(
        public string $clientId,
        public string $clientSecret,
    ) {}

    /**
     * @throws EInvoicingPlatformException
     */
    public static function ofOrFail(?EInvoicingConnection $connection): self
    {
        if (! $connection instanceof EInvoicingConnection) {
            throw new EInvoicingPlatformException(EInvoicingError::NotConnected, 'No e-invoicing platform is connected.');
        }

        return new self($connection->client_id, $connection->client_secret);
    }
}
