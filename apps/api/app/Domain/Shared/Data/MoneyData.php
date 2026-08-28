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

class MoneyData extends Data
{
    /**
     * A ceiling in minor units — a thousand million euros, far above anything a
     * freelance invoices.
     *
     * Uncapped, an amount near PHP_INT_MAX overflows the unsignedBigInteger
     * column once ComputeInvoiceAmounts multiplies it by the TVA rate: a driver
     * 500 on MySQL and Postgres, a silent store on SQLite.
     */
    public const int MAX_AMOUNT = 1_000_000_000_00;

    public function __construct(
        #[IntegerType, Min(1), Max(self::MAX_AMOUNT)]
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
