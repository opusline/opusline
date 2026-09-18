<?php

declare(strict_types=1);

namespace App\Domain\Shared\Validation;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * The PEM Enable Banking hands out when an application is registered: an
 * unencrypted RSA private key, which is what its RS256 tokens are signed
 * with. Checked on save so a wrong paste fails here, not at the first sync.
 */
class EnableBankingPrivateKey implements ValidationRule
{
    private const int MINIMUM_BITS = 2048;

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $key = is_string($value) ? openssl_pkey_get_private($value) : false;
        $details = $key === false ? false : openssl_pkey_get_details($key);

        if ($details === false || $details['type'] !== OPENSSL_KEYTYPE_RSA || $details['bits'] < self::MINIMUM_BITS) {
            $fail(__('rules.enable_banking_private_key'));
        }
    }
}
