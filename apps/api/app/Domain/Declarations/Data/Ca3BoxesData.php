<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Declarations\Vat\Ca3Boxes;
use App\Domain\Shared\Data\MoneyData;
use Cknow\Money\Money;
use Spatie\LaravelData\Data;

/** One figure per case of form n° 3310-CA3, in the order the form lists them. */
class Ca3BoxesData extends Data
{
    public function __construct(
        /** A1 — ventes, prestations de services HT. */
        public MoneyData $salesHt,
        /** 2A — achats de prestations intracommunautaires (autoliquidation UE). */
        public MoneyData $intraCommunityPurchasesHt,
        /** 3B — achats auprès d'un assujetti non établi en France (autoliquidation hors UE). */
        public MoneyData $nonEuPurchasesHt,
        /** 08, base column — ventes plus the two self-assessed purchase lines. */
        public MoneyData $taxableBase,
        /** 08, tax column — TVA collectée, self-assessed TVA included. */
        public MoneyData $collected,
        /** 19 — TVA déductible sur immobilisations. */
        public MoneyData $fixedAssets,
        /** 20 — TVA déductible sur autres biens et services. */
        public MoneyData $goodsAndServices,
        /** 21 — autre TVA à déduire: what earlier declared months pushed here. */
        public MoneyData $otherDeductible,
        /** 22 — crédit reporté from the previous CA3's case 25. */
        public MoneyData $creditCarried,
        /** 25 — crédit de TVA, when the deductible lines exceed the collected one. */
        public MoneyData $credit,
        /** 32 — TVA nette due. */
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
