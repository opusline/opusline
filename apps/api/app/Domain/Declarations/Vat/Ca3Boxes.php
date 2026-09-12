<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Vat;

/**
 * Form n° 3310-CA3, the arithmetic impots.gouv.fr runs on what is typed:
 * the taxable base adds the self-assessed purchases to the sales, the tax
 * column adds their TVA, the deductible lines and the carried credit come
 * off, and whatever is left is due — or, below zero, a credit for next month.
 *
 * Every figure is a sum of cents already rounded per line, the way the
 * invoices and the expenses round theirs; the form never rounds a total.
 */
final readonly class Ca3Boxes
{
    /** Under this, a monthly credit is only carried; from here it may be claimed back (case 26). */
    public const int CREDIT_REFUND_FLOOR_CENTS = 76_000;

    private function __construct(
        public int $salesHt,
        public int $intraCommunityPurchasesHt,
        public int $nonEuPurchasesHt,
        public int $taxableBase,
        public int $collected,
        public int $fixedAssets,
        public int $goodsAndServices,
        public int $otherDeductible,
        public int $creditCarried,
        public int $credit,
        public int $due,
    ) {}

    public static function compute(Ca3Inputs $inputs): self
    {
        $collected = $inputs->collectedVat + $inputs->reverseChargeVat;
        $balance = $collected
            - $inputs->fixedAssetsVat
            - $inputs->goodsAndServicesVat
            - $inputs->otherDeductibleVat
            - $inputs->creditCarried;

        return new self(
            salesHt: $inputs->salesHt,
            intraCommunityPurchasesHt: $inputs->intraCommunityHt,
            nonEuPurchasesHt: $inputs->nonEuHt,
            taxableBase: $inputs->salesHt + $inputs->intraCommunityHt + $inputs->nonEuHt,
            collected: $collected,
            fixedAssets: $inputs->fixedAssetsVat,
            goodsAndServices: $inputs->goodsAndServicesVat,
            otherDeductible: $inputs->otherDeductibleVat,
            creditCarried: $inputs->creditCarried,
            credit: max(0, -$balance),
            due: max(0, $balance),
        );
    }

    public function creditIsRefundable(): bool
    {
        return $this->credit >= self::CREDIT_REFUND_FLOOR_CENTS;
    }
}
