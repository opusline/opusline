<?php

declare(strict_types=1);

namespace App\Domain\Bank\Parsing;

/**
 * The one spelling of how a movement label is assembled from a file's
 * primary/secondary text fields (OFX NAME+MEMO, QIF payee+memo, CAMT
 * unstructured lines).
 */
final class StatementLabel
{
    public const string SEPARATOR = ' · ';

    public static function compose(?string $primary, ?string $secondary): string
    {
        if ($primary !== null && $secondary !== null && $secondary !== $primary) {
            return $primary.self::SEPARATOR.$secondary;
        }

        return $primary ?? $secondary ?? '';
    }
}
