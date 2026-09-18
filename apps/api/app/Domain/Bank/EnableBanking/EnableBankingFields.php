<?php

declare(strict_types=1);

namespace App\Domain\Bank\EnableBanking;

/** Reading loosely-typed Enable Banking payloads, where most fields are optional. */
final class EnableBankingFields
{
    /**
     * The first of $keys holding a non-blank string, trimmed.
     *
     * @param  array<array-key, mixed>  $payload
     * @param  list<string>  $keys
     */
    public static function firstString(array $payload, array $keys): ?string
    {
        foreach ($keys as $key) {
            $value = $payload[$key] ?? null;

            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        return null;
    }
}
