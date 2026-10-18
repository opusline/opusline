<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\QuoteBilling;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Shared\Data\MoneyData;
use Cknow\Money\Money;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * What the quote has billed so far and what it can still bill. The flags
 * are the rules InvoiceQuote enforces, so the screen offers only what the
 * API will accept.
 */
class QuoteBillingData extends Data
{
    /**
     * @param  list<QuoteInvoiceLinkData>  $invoices
     */
    public function __construct(
        #[DataCollectionOf(QuoteInvoiceLinkData::class)]
        public array $invoices,
        /** The total incl. VAT of the linked invoices already issued. */
        public MoneyData $invoicedTtc,
        public bool $canInvoiceDeposit,
        public bool $canInvoiceBalance,
        public bool $canInvoiceFull,
    ) {}

    public static function fromQuote(Quote $quote): self
    {
        // A credit note that cancelled an invoice undid it: the quote bills as if it never went out.
        $invoices = $quote->invoices->reject(static fn (Invoice $invoice): bool => $invoice->status === InvoiceStatus::Cancelled);
        $issued = $invoices->filter(static fn (Invoice $invoice): bool => $invoice->status->isIssued());
        $accepted = $quote->status === QuoteStatus::Accepted;
        $hasDeposit = $invoices->contains(static fn (Invoice $invoice): bool => $invoice->quote_billing === QuoteBilling::Deposit);
        $hasIssuedDeposit = $issued->contains(static fn (Invoice $invoice): bool => $invoice->quote_billing === QuoteBilling::Deposit);
        $hasSettlement = $invoices->contains(static fn (Invoice $invoice): bool => $invoice->quote_billing !== QuoteBilling::Deposit);

        return new self(
            invoices: array_values($quote->invoices->map(QuoteInvoiceLinkData::fromInvoice(...))->all()),
            invoicedTtc: MoneyData::fromMoney($issued->reduce(
                static fn (Money $sum, Invoice $invoice): Money => $sum->add($invoice->creditableAmount()),
                new Money(0, $quote->currency),
            )),
            canInvoiceDeposit: $accepted && $quote->deposit_rate_bp !== null && ! $hasDeposit && ! $hasSettlement,
            canInvoiceBalance: $accepted && $hasIssuedDeposit && ! $hasSettlement,
            canInvoiceFull: $accepted && $invoices->isEmpty(),
        );
    }
}
