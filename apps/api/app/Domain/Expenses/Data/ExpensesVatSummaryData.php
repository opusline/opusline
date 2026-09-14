<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use Spatie\LaravelData\Data;

/** The month's TVA as the CA3 will see it. Null-shaped for accounts that file no CA3. */
class ExpensesVatSummaryData extends Data
{
    public function __construct(
        /** Recoverable TVA claimed on this month's CA3 — receipted purchases of the month, plus what earlier months pushed here. */
        public MoneyData $deductible,
        /** Recoverable TVA of the month's purchases still waiting for a receipt. */
        public MoneyData $blocked,
        public int $blockedCount,
        /** TVA self-assessed under autoliquidation this month: due and deducted, nets to nothing. */
        public MoneyData $reverseCharged,
        /** Recoverable TVA of the month's purchases claimed on a later CA3. */
        public MoneyData $deferred,
        /** TVA collected on the invoices paid this month. */
        public MoneyData $collected,
        /** Collected minus deductible: what the CA3 owes, negative when it carries a credit. */
        public SignedMoneyData $balance,
    ) {}
}
