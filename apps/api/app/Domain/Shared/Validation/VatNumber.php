<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class VatNumber implements ValidationRule
{
    private const string MESSAGE = 'Le numéro de TVA intracommunautaire est invalide.';

    /**
     * @var array<string, string>
     */
    private const array NATIONAL_PATTERNS = [
        'AT' => 'U\d{8}',
        'BE' => '\d{10}',
        'BG' => '\d{9,10}',
        'CY' => '\d{8}[A-Z]',
        'CZ' => '\d{8,10}',
        'DE' => '\d{9}',
        'DK' => '\d{8}',
        'EE' => '\d{9}',
        'EL' => '\d{9}',
        'ES' => '[A-Z0-9]\d{7}[A-Z0-9]',
        'FI' => '\d{8}',
        'FR' => '[A-Z0-9]{2}\d{9}',
        'HR' => '\d{11}',
        'HU' => '\d{8}',
        'IE' => '[A-Z0-9]{8,9}',
        'IT' => '\d{11}',
        'LT' => '(\d{9}|\d{12})',
        'LU' => '\d{8}',
        'LV' => '\d{11}',
        'MT' => '\d{8}',
        'NL' => '\d{9}B\d{2}',
        'PL' => '\d{10}',
        'PT' => '\d{9}',
        'RO' => '\d{2,10}',
        'SE' => '\d{12}',
        'SI' => '\d{8}',
        'SK' => '\d{10}',
    ];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            $fail(self::MESSAGE);

            return;
        }

        $normalized = strtoupper((string) preg_replace('/[\s.]+/', '', $value));
        $country = substr($normalized, 0, 2);
        $pattern = self::NATIONAL_PATTERNS[$country] ?? null;

        if ($pattern === null) {
            $fail(self::MESSAGE);

            return;
        }

        if (preg_match('/^'.$pattern.'$/', substr($normalized, 2)) !== 1) {
            $fail(self::MESSAGE);

            return;
        }

        if ($country === 'FR' && ! $this->hasValidFrenchKey($normalized)) {
            $fail(self::MESSAGE);
        }
    }

    private function hasValidFrenchKey(string $normalized): bool
    {
        $key = substr($normalized, 2, 2);
        $siren = substr($normalized, 4);

        if (preg_match('/^\d{2}$/', $key) !== 1) {
            return true;
        }

        return (int) $key === (12 + 3 * ((int) $siren % 97)) % 97;
    }
}
