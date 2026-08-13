<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * The overdue slice of what is owed. Carries how far gone the worst one is, which
 * is the part that decides whether this needs acting on today.
 */
class InvoiceOverdueData extends Data
{
    public function __construct(
        public MoneyData $amount,
        public int $count,
        public int $maxDaysLate,
    ) {}
}
