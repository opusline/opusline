<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Models\CreditNote;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/** A credit note the editor can deduct from a new invoice of the same client. */
class DeductibleCreditNoteData extends Data
{
    public function __construct(
        public CreditNoteData $creditNote,
        /** The invoice it relates to, by number. */
        public string $invoiceNumber,
        /** What it still owes back: the amount the new invoice will deduct. */
        public MoneyData $amount,
    ) {}

    public static function fromModel(CreditNote $creditNote): self
    {
        return new self(
            creditNote: CreditNoteData::fromModel($creditNote),
            invoiceNumber: (string) $creditNote->invoice->number,
            amount: MoneyData::fromMoney($creditNote->owedBack()),
        );
    }
}
