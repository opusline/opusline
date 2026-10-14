<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Documents\DocumentTotals;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoiceLine;
use App\Domain\Shared\Data\SignedMoneyData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/** What an invoice written in Opusline says, beyond the header every invoice has. */
class InvoiceContentData extends Data
{
    /**
     * @param  list<InvoiceLineData>  $lines
     * @param  list<VatBreakdownRowData>  $vatBreakdown
     */
    public function __construct(
        public ?string $title,
        public ?string $description,
        public DocumentLanguage $language,
        public int $paymentTermsDays,
        public bool $paymentTermsEndOfMonth,
        public ?int $latePenaltyRateBp,
        public bool $showIban,
        public bool $showEmail,
        public ?string $customMentions,
        #[DataCollectionOf(InvoiceLineData::class)]
        public array $lines,
        #[DataCollectionOf(VatBreakdownRowData::class)]
        public array $vatBreakdown,
        /** As printed on the issued document; null on a draft, which prints the live identity. */
        public ?DocumentPartyData $seller,
        public ?DocumentPartyData $buyer,
    ) {}

    public static function fromInvoice(Invoice $invoice): self
    {
        $lines = array_values($invoice->lines->all());
        $totals = DocumentTotals::of(
            array_map(static fn (InvoiceLine $line): array => [
                'quantityMilli' => $line->quantity_milli,
                'unitPrice' => $line->unit_price_cents,
                'vatRateBp' => $line->vat_rate_bp,
            ], $lines),
            $invoice->currency,
        );

        return new self(
            title: $invoice->title,
            description: $invoice->description,
            language: $invoice->language ?? DocumentLanguage::French,
            paymentTermsDays: $invoice->payment_terms_days ?? 0,
            paymentTermsEndOfMonth: $invoice->payment_terms_end_of_month,
            latePenaltyRateBp: $invoice->late_penalty_rate_bp,
            showIban: $invoice->show_iban,
            showEmail: $invoice->show_email,
            customMentions: $invoice->custom_mentions,
            lines: array_map(InvoiceLineData::fromModel(...), $lines),
            vatBreakdown: array_map(static fn (array $row): VatBreakdownRowData => new VatBreakdownRowData(
                rateBp: $row['rateBp'],
                base: SignedMoneyData::fromMoney($row['base']),
                vat: SignedMoneyData::fromMoney($row['vat']),
            ), $totals->vatBreakdown),
            seller: $invoice->seller_snapshot === null ? null : DocumentPartyData::from($invoice->seller_snapshot),
            buyer: $invoice->buyer_snapshot === null ? null : DocumentPartyData::from($invoice->buyer_snapshot),
        );
    }
}
