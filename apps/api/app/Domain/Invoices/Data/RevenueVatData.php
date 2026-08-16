<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * VAT collected over the period. Absent from the response entirely under the
 * franchise en base, where no VAT is charged.
 */
class RevenueVatData extends Data
{
    public function __construct(
        /** Summed from each invoice's own VAT, so historic rate changes stay exact. */
        public MoneyData $amount,
        /** The account's current default rate — caption context, not the sum's input. */
        public int $rateBp,
    ) {}
}
