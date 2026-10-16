<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Documents\DocumentTotals;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Invoices\Models\QuoteLine;
use App\Domain\Shared\Data\SignedMoneyData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/** What the editor holds of a quote, beyond its header: the same shape as an invoice's content, minus what only a payment request carries. */
class QuoteContentData extends Data
{
    /**
     * @param  list<QuoteLineData>  $lines
     * @param  list<VatBreakdownRowData>  $vatBreakdown
     */
    public function __construct(
        public ?string $description,
        public int $paymentTermsDays,
        public bool $paymentTermsEndOfMonth,
        public bool $showEmail,
        public ?string $customMentions,
        #[DataCollectionOf(QuoteLineData::class)]
        public array $lines,
        #[DataCollectionOf(VatBreakdownRowData::class)]
        public array $vatBreakdown,
        /** As printed on the sent document; null on a draft, which prints the live identity. */
        public ?DocumentPartyData $seller,
        public ?DocumentPartyData $buyer,
    ) {}

    public static function fromQuote(Quote $quote): self
    {
        $lines = array_values($quote->lines->all());
        $totals = DocumentTotals::of(
            array_map(static fn (QuoteLine $line): array => [
                'quantityMilli' => $line->quantity_milli,
                'unitPrice' => $line->unit_price_cents,
                'vatRateBp' => $line->vat_rate_bp,
            ], $lines),
            $quote->currency,
        );

        return new self(
            description: $quote->description,
            paymentTermsDays: $quote->payment_terms_days,
            paymentTermsEndOfMonth: $quote->payment_terms_end_of_month,
            showEmail: $quote->show_email,
            customMentions: $quote->custom_mentions,
            lines: array_map(QuoteLineData::fromModel(...), $lines),
            vatBreakdown: array_map(static fn (array $row): VatBreakdownRowData => new VatBreakdownRowData(
                rateBp: $row['rateBp'],
                base: SignedMoneyData::fromMoney($row['base']),
                vat: SignedMoneyData::fromMoney($row['vat']),
            ), $totals->vatBreakdown),
            seller: $quote->seller_snapshot === null ? null : DocumentPartyData::from($quote->seller_snapshot),
            buyer: $quote->buyer_snapshot === null ? null : DocumentPartyData::from($quote->buyer_snapshot),
        );
    }
}
