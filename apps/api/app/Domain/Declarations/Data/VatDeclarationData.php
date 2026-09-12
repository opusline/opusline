<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * The monthly CA3 helper — one figure per form case, cash basis like the
 * revenue screen. Only réel normal declares monthly, so this block exists for
 * that regime alone. The deductible lines read the expense journal; the credit
 * chains from one month to the next the way the form carries it.
 */
class VatDeclarationData extends Data
{
    public function __construct(
        /** The declared month's key, `2026-07`. */
        public string $period,
        /** The régime this block was built for, so the client captions it rather than guessing. */
        public VatRegime $regime,
        /** Case A1 — services sold HT, summed from the invoices paid in the month. Duplicates boxes.salesHt for the current web card; the web rung drops it. */
        public MoneyData $salesHt,
        /** The VAT those invoices actually carried, per-invoice actuals — self-assessed TVA excluded. */
        public MoneyData $collected,
        /**
         * The one rate every paid invoice carries — caption context, not the sum's
         * input. Null once they disagree; the account default on an empty month.
         */
        public ?int $rateBp,
        public Ca3BoxesData $boxes,
        /** How many invoices were collected in the month. */
        public int $invoiceCount,
        /** How many purchases the month's journal holds. */
        public int $expenseCount,
        /** TVA self-assessed under autoliquidation — due and deducted, nets to nothing. */
        public MoneyData $reverseChargedVat,
        /** Whether case 25 reaches the floor the fisc refunds monthly (« remboursement mensuel »). */
        public bool $creditIsRefundable,
        /** Null for a month the account did not exist in. */
        public ?DeclarationDeadlineData $deadline,
        public ?DeclarationCompletionData $completion,
        public DeclarationSettlementData $settlement,
    ) {}
}
