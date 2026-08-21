<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use Spatie\LaravelData\Data;

/**
 * A fixed-price mission read two ways at once: how much of the price has been
 * invoiced, and how much of it the time tracked has already eaten. They are
 * independent — a forfait can be fully invoiced and still overrun, which is exactly
 * the case worth warning about.
 */
class FixedPriceBudgetData extends Data
{
    public function __construct(
        /** The contract: the mission's rate, which on a forfait is the whole price. */
        public MoneyData $forfait,
        /** Issued HT — sent and paid. */
        public MoneyData $invoiced,
        /** Draft HT: written down, not yet handed over, but no longer free to bill twice. */
        public MoneyData $draft,
        /**
         * forfait − invoiced − draft. Signed: over-invoicing a forfait is a real state,
         * and hiding it behind a zero is how it stays unnoticed.
         */
        public SignedMoneyData $remaining,
        public int $invoicedShareBp,
        public ?FixedPriceConsumptionData $consumption,
    ) {}
}
