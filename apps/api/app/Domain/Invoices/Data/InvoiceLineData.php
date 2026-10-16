<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\InvoiceLine;
use App\Domain\Shared\Data\SignedMoneyData;
use Spatie\LaravelData\Data;

class InvoiceLineData extends Data
{
    public function __construct(
        public int $id,
        public string $label,
        public ?string $detail,
        public int $quantityMilli,
        public LineUnit $unit,
        public SignedMoneyData $unitPrice,
        public int $vatRateBp,
        public SignedMoneyData $totalHt,
    ) {}

    public static function fromModel(InvoiceLine $line): self
    {
        return new self(
            id: $line->id,
            label: $line->label,
            detail: $line->detail,
            quantityMilli: $line->quantity_milli,
            unit: $line->unit,
            unitPrice: SignedMoneyData::fromMoney($line->unit_price_cents),
            vatRateBp: $line->vat_rate_bp,
            totalHt: SignedMoneyData::fromMoney($line->total_ht_cents),
        );
    }
}
