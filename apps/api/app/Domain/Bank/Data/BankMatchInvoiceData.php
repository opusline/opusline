<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Invoices\Models\Invoice;
use Spatie\LaravelData\Data;

class BankMatchInvoiceData extends Data
{
    public function __construct(
        public int $id,
        public ?string $number,
        public string $clientName,
    ) {}

    public static function fromModel(Invoice $invoice): self
    {
        return new self(
            id: $invoice->id,
            number: $invoice->number,
            clientName: $invoice->client->name,
        );
    }
}
