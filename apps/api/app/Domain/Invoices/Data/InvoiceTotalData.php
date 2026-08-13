<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * One KPI tile: an amount and how many things it was summed from.
 */
class InvoiceTotalData extends Data
{
    public function __construct(
        public MoneyData $amount,
        public int $count,
    ) {}
}
