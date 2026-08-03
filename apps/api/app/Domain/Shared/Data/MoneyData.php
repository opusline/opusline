<?php

declare(strict_types=1);

namespace App\Domain\Shared\Data;

use App\Domain\Shared\Enums\Currency;
use Cknow\Money\Money;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

class MoneyData extends Data
{
    public function __construct(
        public int $amount,
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

    /**
     * @return array<string, list<mixed>>
     */
    public static function rules(): array
    {
        return [
            'amount' => ['required', 'integer', 'min:1'],
            'currency' => ['required', Rule::enum(Currency::class)],
        ];
    }
}
