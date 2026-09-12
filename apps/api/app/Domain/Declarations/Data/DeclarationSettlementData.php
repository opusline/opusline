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
 * `provisioned` only means something while the period is the one the
 * provisions engine carries — the last closed one — and its payment has
 * not been recorded: it is that carry, capped by what the balance can
 * actually cover once pending transfers and the other provisions come
 * off. Older periods and paid ones read null, never a stale figure.
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
     * @param  ?Money  $provisioned  null when the period is not the one the engine carries, or is paid, or the balance is unknown
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
