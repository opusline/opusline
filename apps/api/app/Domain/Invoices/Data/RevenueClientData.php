<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Enums\Color;
use Spatie\LaravelData\Data;

/**
 * One client's slice of the period's revenue, for the breakdown table.
 */
class RevenueClientData extends Data
{
    public function __construct(
        public int $clientId,
        public string $clientName,
        public Color $color,
        public int $invoiceCount,
        public MoneyData $total,
        /** Share of the period total, in basis points — shares sum to ten thousand. */
        public int $shareBp,
    ) {}
}
