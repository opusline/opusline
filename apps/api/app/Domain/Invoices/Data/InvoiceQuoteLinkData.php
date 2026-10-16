<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\QuoteBilling;
use App\Domain\Invoices\Models\Invoice;
use Spatie\LaravelData\Data;

/** The quote an invoice was built from, as its page links back to it. */
class InvoiceQuoteLinkData extends Data
{
    public function __construct(
        public int $quoteId,
        public ?string $number,
        public QuoteBilling $billing,
    ) {}

    public static function fromInvoice(Invoice $invoice): ?self
    {
        if ($invoice->quote_id === null || $invoice->quote_billing === null) {
            return null;
        }

        return new self($invoice->quote_id, $invoice->quote?->number, $invoice->quote_billing);
    }
}
