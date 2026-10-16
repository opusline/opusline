<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

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
}
