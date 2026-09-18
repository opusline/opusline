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
 * MoneyData with zero allowed, for figures where zero is an answer rather than
 * an absence: the revenu fiscal de référence of a year with no taxable income
 * in France. Prices and invoice amounts stay on MoneyData.
 *
 * The magnitude cap is shared, so a bound raised for one is raised for both.
 */
class UnsignedMoneyData extends Data
{
    public function __construct(
        #[IntegerType, Min(0), Max(MoneyData::MAX_AMOUNT)]
        public int $amount,
        #[Rule(new AccountCurrency)]
        public Currency $currency,
    ) {}

    public function toMoney(): Money
    {
        return new Money($this->amount, $this->currency->value);
    }
}
