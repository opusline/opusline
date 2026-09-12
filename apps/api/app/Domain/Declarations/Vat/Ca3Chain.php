<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Vat;

use App\Domain\Expenses\Vat\DeductibleExpenses;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use Carbon\CarbonImmutable;
use InvalidArgumentException;

/**
 * The CA3s of an account in order, because each month starts with the
 * credit the previous one ended on. Computed from the data rather than
 * from what was typed on impots.gouv.fr — an estimate of the chain the
 * fisc holds, honest as long as every return was filed as shown.
 */
final readonly class Ca3Chain
{
    public function __construct(
        private CollectedInvoices $invoices,
        public DeductibleExpenses $expenses,
        /** The first month the chain runs from; nothing is carried into it. */
        public CarbonImmutable $firstMonth,
    ) {}

    public function boxes(CarbonImmutable $month): Ca3Boxes
    {
        if ($month->lessThan($this->firstMonth)) {
            throw new InvalidArgumentException("The CA3 chain starts at {$this->firstMonth->format('Y-m')}; {$month->format('Y-m')} is before it.");
        }

        $credit = 0;
        $boxes = null;

        for ($cursor = $this->firstMonth; $cursor->lessThanOrEqualTo($month); $cursor = $cursor->addMonth()) {
            $boxes = Ca3Boxes::compute($this->inputs($cursor, $credit));
            $credit = $boxes->credit;
        }

        assert($boxes instanceof Ca3Boxes);

        return $boxes;
    }

    private function inputs(CarbonImmutable $monthStart, int $creditCarried): Ca3Inputs
    {
        $monthEnd = $monthStart->endOfMonth();
        $month = $monthStart->format('Y-m');

        return new Ca3Inputs(
            salesHt: $this->invoices->htCents($monthStart, $monthEnd),
            collectedVat: $this->invoices->vatCents($monthStart, $monthEnd),
            intraCommunityHt: $this->expenses->intraCommunityHtCents($month),
            nonEuHt: $this->expenses->nonEuHtCents($month),
            reverseChargeVat: $this->expenses->reverseChargeVatCents($month),
            // Case 19 waits for the opening-credit settings of a later rung.
            fixedAssetsVat: 0,
            goodsAndServicesVat: $this->expenses->goodsAndServicesVatCents($month),
            otherDeductibleVat: $this->expenses->otherDeductibleVatCents($month),
            creditCarried: $creditCarried,
        );
    }
}
