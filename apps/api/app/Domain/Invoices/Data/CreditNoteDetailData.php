<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Models\CreditNote;
use App\Domain\Invoices\Revenue\NetIncome;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class CreditNoteDetailData extends Data
{
    /**
     * @param  list<CreditNoteLineData>  $lines
     */
    public function __construct(
        public CreditNoteData $creditNote,
        /** The invoice it relates to, as it stands after it. */
        public InvoiceData $invoice,
        #[DataCollectionOf(CreditNoteLineData::class)]
        public array $lines,
    ) {}

    public static function fromModel(CreditNote $creditNote, ?NetIncome $netIncome): self
    {
        return new self(
            creditNote: CreditNoteData::fromModel($creditNote),
            invoice: InvoiceData::fromModel($creditNote->invoice, $netIncome),
            lines: array_values($creditNote->lines->map(CreditNoteLineData::fromModel(...))->all()),
        );
    }
}
