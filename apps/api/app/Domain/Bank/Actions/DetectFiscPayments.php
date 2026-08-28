<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

/**
 * Recognizes the fisc's debits in bank labels: URSSAF prélèvements, TVA
 * télérèglements and the CFE. Matching is word-bounded on a normalized
 * label — "TVA" the word, never the letters inside "NUIT VALENCE" — and
 * deliberately narrow: a bare DGFiP debit is NOT treated as TVA, because the
 * DGFiP also collects income tax through the same channel.
 */
final class DetectFiscPayments
{
    public static function isUrssaf(string $label): bool
    {
        return preg_match('/\bURSSAF\b/', self::normalized($label)) === 1;
    }

    public static function isVat(string $label): bool
    {
        return preg_match('/\bTVA\b/', self::normalized($label)) === 1;
    }

    public static function isCfe(string $label): bool
    {
        return preg_match('/\bCFE\b/', self::normalized($label)) === 1;
    }

    private static function normalized(string $label): string
    {
        return trim(preg_replace('/[^A-Z0-9]+/', ' ', NormalizeBankText::foldAccents($label)) ?? '');
    }
}
