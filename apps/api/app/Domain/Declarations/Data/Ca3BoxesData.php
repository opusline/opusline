<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Declarations\Vat\Ca3Boxes;
use App\Domain\Shared\Data\MoneyData;
use Cknow\Money\Money;
use Spatie\LaravelData\Data;

/** One figure per box of form n° 3310-CA3, in the order the form lists them. */
class Ca3BoxesData extends Data
{
    public function __construct(
        /** A1 — sales and services, HT. */
        public MoneyData $salesHt,
        /** 2A — intra-community purchases of services (EU reverse charge). */
        public MoneyData $intraCommunityPurchasesHt,
        /** 3B — purchases from a supplier not established in France (non-EU reverse charge). */
        public MoneyData $nonEuPurchasesHt,
        /** 08, base column — sales plus the two self-assessed purchase lines. */
        public MoneyData $taxableBase,
        /** 08, tax column — collected TVA, self-assessed TVA included. */
        public MoneyData $collected,
        /** 19 — deductible TVA on fixed assets. */
        public MoneyData $fixedAssets,
        /** 20 — deductible TVA on other goods and services. */
        public MoneyData $goodsAndServices,
        /** 21 — other deductible TVA: what earlier declared months pushed here. */
        public MoneyData $otherDeductible,
        /** 22 — the credit carried from the previous CA3's box 25. */
        public MoneyData $creditCarried,
        /** 25 — TVA credit, when the deductible lines exceed the collected one. */
        public MoneyData $credit,
        /** 32 — net TVA due. */
        public MoneyData $due,
    ) {}

    public static function fromBoxes(Ca3Boxes $boxes, string $currency): self
    {
        $money = static fn (int $cents): MoneyData => MoneyData::fromMoney(new Money($cents, $currency));

        return new self(
            salesHt: $money($boxes->salesHt),
            intraCommunityPurchasesHt: $money($boxes->intraCommunityPurchasesHt),
            nonEuPurchasesHt: $money($boxes->nonEuPurchasesHt),
            taxableBase: $money($boxes->taxableBase),
            collected: $money($boxes->collected),
            fixedAssets: $money($boxes->fixedAssets),
            goodsAndServices: $money($boxes->goodsAndServices),
            otherDeductible: $money($boxes->otherDeductible),
            creditCarried: $money($boxes->creditCarried),
            credit: $money($boxes->credit),
            due: $money($boxes->due),
        );
    }
}
