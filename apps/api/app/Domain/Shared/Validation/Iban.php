<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/** ISO 13616: two letters, two check digits, then up to 30 characters; the whole number modulo 97 is 1. */
class Iban implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            $fail(__('rules.iban'));

            return;
        }

        $iban = self::normalize($value);

        if (preg_match('/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/', $iban) !== 1 || ! $this->hasValidChecksum($iban)) {
            $fail(__('rules.iban'));
        }
    }

    /** As the bank prints it in groups of four, or typed lowercase: stored as one uppercase run. */
    public static function normalize(string $iban): string
    {
        return strtoupper((string) preg_replace('/\s+/', '', $iban));
    }

    private function hasValidChecksum(string $iban): bool
    {
        $rearranged = substr($iban, 4).substr($iban, 0, 4);
        $remainder = 0;

        // Letters become 10–35; the number is far too long for an int, so the
        // remainder is carried digit by digit.
        foreach (str_split($rearranged) as $character) {
            $digits = ctype_alpha($character) ? (string) (ord($character[0]) - 55) : $character;

            foreach (str_split($digits) as $digit) {
                $remainder = ($remainder * 10 + (int) $digit) % 97;
            }
        }

        return $remainder === 1;
    }
}
