<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\CatalogItem;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

class CatalogItemData extends Data
{
    public function __construct(
        public int $id,
        public string $label,
        public ?string $detail,
        public LineUnit $unit,
        public MoneyData $unitPrice,
        public int $vatRateBp,
    ) {}

    public static function fromModel(CatalogItem $item): self
    {
        return new self(
            id: $item->id,
            label: $item->label,
            detail: $item->detail,
            unit: $item->unit,
            unitPrice: MoneyData::fromMoney($item->unit_price_cents),
            vatRateBp: $item->vat_rate_bp,
        );
    }
}
