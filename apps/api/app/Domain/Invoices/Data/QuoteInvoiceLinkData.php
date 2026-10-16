<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\QuoteBilling;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/** An invoice built from the quote, as « Factures liées » lists it. */
class QuoteInvoiceLinkData extends Data
{
    public function __construct(
        public int $id,
        public ?string $number,
        public InvoiceStatus $status,
        public bool $isLate,
        public QuoteBilling $billing,
        public MoneyData $amountTtc,
    ) {}

    public static function fromInvoice(Invoice $invoice): self
    {
        return new self(
            id: $invoice->id,
            number: $invoice->number,
            status: $invoice->status,
            isLate: $invoice->isLate(),
            billing: $invoice->quote_billing ?? QuoteBilling::Full,
            amountTtc: MoneyData::fromMoney($invoice->amount_ttc_cents),
        );
    }
}
