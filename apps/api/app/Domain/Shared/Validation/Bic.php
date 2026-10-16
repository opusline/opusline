<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/** ISO 9362: bank code, country, location, then an optional three-character branch. */
class Bic implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || preg_match('/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/', self::normalize($value)) !== 1) {
            $fail(__('rules.bic'));
        }
    }

    public static function normalize(string $bic): string
    {
        return strtoupper(trim($bic));
    }
}
