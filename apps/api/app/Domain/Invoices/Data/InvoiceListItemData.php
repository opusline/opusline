<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Clients\Data\ClientData;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Data\MissionData;
use Spatie\LaravelData\Data;

/**
 * An invoice with the client and mission it is filed under. The Factures screen
 * groups rows by client and labels them by mission, so both travel with the row
 * rather than being looked up per invoice.
 */
class InvoiceListItemData extends Data
{
    public function __construct(
        public InvoiceData $invoice,
        public ClientData $client,
        public ?MissionData $mission,
    ) {}

    public static function fromModel(Invoice $invoice): self
    {
        return new self(
            invoice: InvoiceData::fromModel($invoice),
            client: ClientData::from($invoice->client),
            mission: $invoice->mission === null ? null : MissionData::from($invoice->mission),
        );
    }
}
