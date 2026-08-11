<?php

declare(strict_types=1);

namespace App\Domain\Settings\Rates;

/**
 * The barème in force for one situation, as read from URSSAF.
 *
 * Rates are exact basis points — 25,60 % is 2560 — so nothing here is ever a
 * float, matching how they are stored and how provisions are computed.
 */
class OfficialRates
{
    public function __construct(
        public readonly int $contributionRateBp,
        public readonly int $liberatingPaymentRateBp,
        public readonly int $year,
    ) {}
}
