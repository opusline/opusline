<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use Cknow\Money\Money;
use Spatie\LaravelData\Data;

/**
 * What the period costs against what the compte pro holds for it.
 *
 * `provisioned` only means something while the provisions engine carries
 * the period — closed inside the past year, neither marked paid nor
 * settled by a detected payment: it is that carry, capped by what the
 * balance can actually cover once pending transfers, the other provisions
 * and the older carries come off. Other periods read null, never a stale
 * figure.
 */
class DeclarationSettlementData extends Data
{
    public function __construct(
        /** The period's total — the URSSAF lines summed, or CA3 case 32. */
        public MoneyData $expected,
        public ?MoneyData $provisioned,
        /** provisioned − expected; negative when the account is short. */
        public ?SignedMoneyData $gap,
        /** The fisc's debits of this kind detected in the period that follows — what was actually paid. */
        public MoneyData $detectedPayments,
    ) {}

    /**
     * @param  ?Money  $provisioned  null when the engine does not carry the period, or the balance is unknown
     */
    public static function of(Money $expected, int $detectedPayments, ?Money $provisioned): self
    {
        return new self(
            expected: MoneyData::fromMoney($expected),
            provisioned: $provisioned instanceof Money ? MoneyData::fromMoney($provisioned) : null,
            gap: $provisioned instanceof Money ? SignedMoneyData::fromMoney($provisioned->subtract($expected)) : null,
            detectedPayments: MoneyData::fromMoney(new Money($detectedPayments, $expected->getCurrency()->getCode())),
        );
    }
}
