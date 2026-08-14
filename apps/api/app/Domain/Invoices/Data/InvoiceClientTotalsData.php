<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * The gross totals one client's rows add up to on the Factures screen, one per
 * scope chip. Summed here rather than in the browser: the frontend never does
 * money arithmetic — totals always come from the API.
 *
 * "Late" overlaps "open" the way the chips do: lateness is derived from the due
 * date, not a separate status, so an overdue invoice is counted by both.
 */
class InvoiceClientTotalsData extends Data
{
    public function __construct(
        public int $clientId,
        public MoneyData $all,
        public MoneyData $open,
        public MoneyData $late,
        public MoneyData $paid,
        public MoneyData $draft,
    ) {}
}
