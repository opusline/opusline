<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * ISO 13616: two letters, two check digits, then the BBAN; the whole number modulo 97 is 1.
 * The checksum alone lets a truncated number through, so the country must be one the
 * IBAN registry lists and the length must be the one it fixes for that country.
 */
class Iban implements ValidationRule
{
    /** Length per country, from the SWIFT IBAN Registry (release 99, 2025). */
    private const array LENGTHS = [
        'AD' => 24, 'AE' => 23, 'AL' => 28, 'AT' => 20, 'AZ' => 28, 'BA' => 20, 'BE' => 16, 'BG' => 22,
        'BH' => 22, 'BI' => 27, 'BR' => 29, 'BY' => 28, 'CH' => 21, 'CR' => 22, 'CY' => 28, 'CZ' => 24,
        'DE' => 22, 'DJ' => 27, 'DK' => 18, 'DO' => 28, 'EE' => 20, 'EG' => 29, 'ES' => 24, 'FI' => 18,
        'FK' => 18, 'FO' => 18, 'FR' => 27, 'GB' => 22, 'GE' => 22, 'GI' => 23, 'GL' => 18, 'GR' => 27,
        'GT' => 28, 'HN' => 28, 'HR' => 21, 'HU' => 28, 'IE' => 22, 'IL' => 23, 'IQ' => 23, 'IS' => 26,
        'IT' => 27, 'JO' => 30, 'KW' => 30, 'KZ' => 20, 'LB' => 28, 'LC' => 32, 'LI' => 21, 'LT' => 20,
        'LU' => 20, 'LV' => 21, 'LY' => 25, 'MC' => 27, 'MD' => 24, 'ME' => 22, 'MK' => 19, 'MN' => 20,
        'MR' => 27, 'MT' => 31, 'MU' => 30, 'NI' => 28, 'NL' => 18, 'NO' => 15, 'OM' => 23, 'PK' => 24,
        'PL' => 28, 'PS' => 29, 'PT' => 25, 'QA' => 29, 'RO' => 24, 'RS' => 22, 'RU' => 33, 'SA' => 24,
        'SC' => 31, 'SD' => 18, 'SE' => 24, 'SI' => 19, 'SK' => 24, 'SM' => 27, 'SO' => 23, 'ST' => 25,
        'SV' => 28, 'TL' => 23, 'TN' => 24, 'TR' => 26, 'UA' => 29, 'VA' => 22, 'VG' => 24, 'XK' => 20,
        'YE' => 30,
    ];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            $fail(__('rules.iban'));

            return;
        }

        $iban = self::normalize($value);

        if (! $this->hasRegisteredLength($iban) || ! $this->hasValidChecksum($iban)) {
            $fail(__('rules.iban'));
        }
    }

    /** As the bank prints it in groups of four, or typed lowercase: stored as one uppercase run. */
    public static function normalize(string $iban): string
    {
        return strtoupper((string) preg_replace('/\s+/', '', $iban));
    }

    private function hasRegisteredLength(string $iban): bool
    {
        if (preg_match('/^[A-Z]{2}\d{2}[A-Z0-9]+$/', $iban) !== 1) {
            return false;
        }

        $length = self::LENGTHS[substr($iban, 0, 2)] ?? null;

        return $length !== null && strlen($iban) === $length;
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
