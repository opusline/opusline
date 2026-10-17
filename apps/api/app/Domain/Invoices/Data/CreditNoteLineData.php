<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\CreditNoteLine;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

class CreditNoteLineData extends Data
{
    public function __construct(
        public int $id,
        public ?int $invoiceLineId,
        public string $label,
        public ?string $detail,
        public int $quantityMilli,
        public LineUnit $unit,
        public MoneyData $unitPrice,
        public int $vatRateBp,
        public MoneyData $totalHt,
    ) {}

    public static function fromModel(CreditNoteLine $line): self
    {
        return new self(
            id: $line->id,
            invoiceLineId: $line->invoice_line_id,
            label: $line->label,
            detail: $line->detail,
            quantityMilli: $line->quantity_milli,
            unit: $line->unit,
            unitPrice: MoneyData::fromMoney($line->unit_price_cents),
            vatRateBp: $line->vat_rate_bp,
            totalHt: MoneyData::fromMoney($line->total_ht_cents),
        );
    }
}
