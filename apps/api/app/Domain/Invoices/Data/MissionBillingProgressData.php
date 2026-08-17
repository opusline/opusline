<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use Spatie\LaravelData\Data;

/**
 * How much of a forfait mission's agreed price has been billed.
 *
 * Only a fixed-price mission has this shape: a day- or hour-billed mission has
 * no agreed total to measure against, so the endpoint answers null for it
 * rather than inventing a denominator.
 */
class MissionBillingProgressData extends Data
{
    public function __construct(
        /** The agreed price the mission was sold at. */
        public MoneyData $fixedPrice,
        /** Issued HT across every invoice on the mission — drafts excluded. */
        public MoneyData $invoiced,
        /**
         * Still to bill. Signed: past the agreed price this goes negative, which
         * is a real state — scope grew and the extra was invoiced — and is what
         * `isOverBilled` reads.
         */
        public SignedMoneyData $remaining,
        /** Share of the agreed price already billed, in basis points. */
        public int $progressBp,
        /** Whether more has been billed than the mission was sold for. */
        public bool $isOverBilled,
        /** Issued invoices on the mission, and drafts not yet counted above. */
        public int $issuedCount,
        public int $draftCount,
    ) {}
}
