<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\DocumentLanguage;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * An invoice or a quote as its sheet prints it: every label, amount and mention already
 * resolved in the document's language. The PDF and the web preview both
 * render this one shape, so their wording cannot drift.
 */
class InvoicePaperData extends Data
{
    /**
     * @param  list<PaperRowData>  $meta
     * @param  list<PaperLineData>  $lines
     * @param  list<PaperVatRowData>  $vatRows
     * @param  list<PaperTotalData>  $totals
     * @param  list<PaperRowData>  $payment
     */
    public function __construct(
        public DocumentLanguage $language,
        /** What follows a label: « : » in French typography, « : » glued in English. */
        public string $labelSeparator,
        public string $title,
        /** « Brouillon » across a draft; null once issued. */
        public ?string $stamp,
        public bool $hasLogo,
        #[DataCollectionOf(PaperRowData::class)]
        public array $meta,
        public PaperPartyData $seller,
        public PaperPartyData $buyer,
        public ?string $documentTitle,
        public ?string $description,
        public PaperLineHeadData $head,
        #[DataCollectionOf(PaperLineData::class)]
        public array $lines,
        public string $noLinesLabel,
        public PaperVatHeadData $vatHead,
        #[DataCollectionOf(PaperVatRowData::class)]
        public array $vatRows,
        #[DataCollectionOf(PaperTotalData::class)]
        public array $totals,
        public ?string $paymentTitle,
        #[DataCollectionOf(PaperRowData::class)]
        public array $payment,
        public string $legal,
        /** A quote ends with the box the client signs; an invoice has none. */
        public ?PaperSignatureData $signature,
        public string $footer,
    ) {}
}
