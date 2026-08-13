<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class InvoiceNumberFormat implements ValidationRule
{
    private const string COUNTER_TOKEN = 'NNN';

    /** @var list<string> */
    private const array TOKENS = ['AAAA', 'MM', self::COUNTER_TOKEN];

    private const string MESSAGE = 'Le format doit contenir NNN et n\'accepter que les jetons AAAA, MM et NNN.';

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! str_contains($value, self::COUNTER_TOKEN)) {
            $fail(self::MESSAGE);

            return;
        }

        $literals = str_replace(self::TOKENS, '', $value);

        if (preg_match('/^[A-Za-z0-9\-\/_. ]*$/', $literals) !== 1) {
            $fail(self::MESSAGE);
        }
    }
}
