<?php

declare(strict_types=1);

namespace App\Domain\Invoices\CreditNotes;

use App\Domain\Invoices\Documents\DocumentTotals;
use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\LineUnit;
use Cknow\Money\Money;

/**
 * A credit note as the rules settle it, before it is stored: its lines, its
 * totals and what becomes of its amount. The preview prints it; issuing
 * stores it.
 */
final readonly class CreditNoteDraft
{
    /**
     * @param  list<array{label: string, detail: ?string, quantityMilli: int, unit: LineUnit, unitPrice: Money, vatRateBp: int, invoiceLineId: ?int}>  $lines
     */
    public function __construct(
        public CreditNoteKind $kind,
        public CreditNoteReason $reason,
        public ?string $detail,
        public CreditNoteSettlement $settlement,
        public DocumentLanguage $language,
        public array $lines,
        public DocumentTotals $totals,
    ) {}
}
