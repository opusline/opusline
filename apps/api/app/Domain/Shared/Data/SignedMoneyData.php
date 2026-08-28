<?php

declare(strict_types=1);

namespace App\Domain\Shared\Data;

use App\Domain\Shared\Enums\Currency;
use App\Domain\Shared\Validation\AccountCurrency;
use Cknow\Money\Money;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

/**
 * MoneyData without the positive-amount floor, for figures where sign carries
 * meaning: bank movements (debits are negative) and account balances (an
 * overdraft is a legal state). Prices and invoice amounts stay on MoneyData.
 *
 * The magnitude cap is shared, so a bound raised for one is raised for both.
 */
class SignedMoneyData extends Data
{
    public function __construct(
        #[IntegerType, Min(-MoneyData::MAX_AMOUNT), Max(MoneyData::MAX_AMOUNT)]
        public int $amount,
        #[Rule(new AccountCurrency)]
        public Currency $currency,
    ) {}

    public static function fromMoney(Money $money): self
    {
        return new self(
            amount: (int) $money->getAmount(),
            currency: Currency::from($money->getCurrency()->getCode()),
        );
    }

    public function toMoney(): Money
    {
        return new Money($this->amount, $this->currency->value);
    }
}
