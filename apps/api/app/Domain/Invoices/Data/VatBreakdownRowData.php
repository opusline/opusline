<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Documents\DocumentTotals;
use App\Domain\Shared\Data\SignedMoneyData;
use Spatie\LaravelData\Data;

/** One row of the per-rate VAT table a French invoice prints. */
class VatBreakdownRowData extends Data
{
    public function __construct(
        public int $rateBp,
        public SignedMoneyData $base,
        public SignedMoneyData $vat,
    ) {}

    /**
     * The document's VAT table, rate by rate.
     *
     * @return list<self>
     */
    public static function listOf(DocumentTotals $totals): array
    {
        return array_map(static fn (array $row): self => new self(
            rateBp: $row['rateBp'],
            base: SignedMoneyData::fromMoney($row['base']),
            vat: SignedMoneyData::fromMoney($row['vat']),
        ), $totals->vatBreakdown);
    }
}
