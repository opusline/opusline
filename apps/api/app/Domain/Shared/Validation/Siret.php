<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Siret implements ValidationRule
{
    private const string LA_POSTE_SIREN = '356000000';

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            $fail(__('rules.siret'));

            return;
        }

        $digits = (string) preg_replace('/[\s.]+/', '', $value);

        if (preg_match('/^\d{14}$/', $digits) !== 1) {
            $fail(__('rules.siret'));

            return;
        }

        if (! $this->hasValidChecksum($digits)) {
            $fail(__('rules.siret'));
        }
    }

    private function hasValidChecksum(string $digits): bool
    {
        if (str_starts_with($digits, self::LA_POSTE_SIREN)) {
            return array_sum(str_split($digits)) % 5 === 0;
        }

        $sum = 0;

        foreach (array_reverse(str_split($digits)) as $position => $digit) {
            $number = (int) $digit;

            if ($position % 2 === 1) {
                $number *= 2;

                if ($number > 9) {
                    $number -= 9;
                }
            }

            $sum += $number;
        }

        return $sum % 10 === 0;
    }
}
