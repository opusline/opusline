<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Data;

use App\Domain\EInvoicing\Enums\PlatformEnvironment;
use App\Domain\EInvoicing\Models\EInvoicingConnection;
use Spatie\LaravelData\Data;

/** The account's plateforme agréée, minus the client secret, which never leaves the server. */
class EInvoicingSettingsData extends Data
{
    public function __construct(
        /** Null until the account saved an application. */
        public ?string $clientId,
        public ?string $companyName,
        /** The SIREN the platform enrolled, as it reports it. */
        public ?string $companyNumber,
        public ?PlatformEnvironment $environment,
        /** Business calls answer 403 until the platform verified the company. */
        public bool $companyVerified,
        /** Where the annuaire routes the account's invoices; null until it registered there. */
        public ?string $receivingAddress,
        /** When the platform was last asked, ISO 8601. */
        public ?string $checkedAt,
    ) {}

    public static function fromConnection(?EInvoicingConnection $connection): self
    {
        if (! $connection instanceof EInvoicingConnection) {
            return new self(null, null, null, null, false, null, null);
        }

        return new self(
            clientId: $connection->client_id,
            companyName: $connection->company_name,
            companyNumber: $connection->company_number,
            environment: $connection->environment,
            companyVerified: $connection->company_verified,
            receivingAddress: $connection->receiving_address,
            checkedAt: $connection->checked_at?->toIso8601String(),
        );
    }
}
