<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Clients\Data\ClientData;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Data\MissionData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class InvoiceDetailData extends Data
{
    /**
     * @param  list<InvoiceEventData>  $history
     */
    public function __construct(
        public InvoiceData $invoice,
        public ClientData $client,
        public ?MissionData $mission,
        #[DataCollectionOf(InvoiceEventData::class)]
        public array $history,
    ) {}

    public static function fromModel(Invoice $invoice): self
    {
        return new self(
            invoice: InvoiceData::fromModel($invoice),
            client: ClientData::from($invoice->client),
            mission: $invoice->mission === null ? null : MissionData::from($invoice->mission),
            history: array_values(InvoiceEventData::collect($invoice->events->all(), 'array')),
        );
    }
}
