<?php

declare(strict_types=1);

namespace App\Domain\Shared\Data;

use App\Domain\Shared\Enums\Currency;
use App\Domain\Shared\Validation\AccountCurrency;
use Cknow\Money\Money;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class MoneyData extends Data
{
    public function __construct(
        #[IntegerType, Min(1)]
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
