<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Arr;

/**
 * Art. L441-10 C. com.: an agreed payment term may not exceed 60 days from
 * the invoice date, or 45 days counted from the end of its month.
 */
class LegalPaymentTerms implements DataAwareRule, ValidationRule
{
    /** @var array<string, mixed> */
    private array $data = [];

    public function __construct(private readonly string $endOfMonthField) {}

    /** @param  array<string, mixed>  $data */
    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $endOfMonth = filter_var(Arr::get($this->data, $this->endOfMonthField), FILTER_VALIDATE_BOOLEAN);
        $maximum = $endOfMonth ? 45 : 60;

        if (! is_int($value) || $value < 0 || $value > $maximum) {
            $fail(__($endOfMonth ? 'rules.payment_terms_end_of_month' : 'rules.payment_terms'));
        }
    }
}
