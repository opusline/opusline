<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Vat;

/** What one month feeds the form, in cents, before the form's own arithmetic. */
final readonly class Ca3Inputs
{
    public function __construct(
        public int $salesHt,
        public int $collectedVat,
        public int $intraCommunityHt,
        public int $nonEuHt,
        public int $reverseChargeVat,
        public int $fixedAssetsVat,
        public int $goodsAndServicesVat,
        public int $otherDeductibleVat,
        public int $creditCarried,
    ) {}
}
