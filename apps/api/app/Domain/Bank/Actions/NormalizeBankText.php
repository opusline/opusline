<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

/**
 * Bank labels mangle whatever they carry: uppercase, accents dropped,
 * punctuation eaten, spacing arbitrary ("VIR SEPA CALLISTO SA REF F2026041"
 * for invoice "F-2026-041"). Matching therefore happens in a normalized space
 * where only letters and digits survive.
 */
final class NormalizeBankText
{
    private const array LEGAL_FORMS = ['SASU', 'SARL', 'EURL', 'SAS', 'SNC', 'SCI', 'SA'];

    /**
     * The one accent table every bank-text normalizer builds on — the CSV
     * header matcher, the fisc-payment detector and this class's own
     * normalize() differ only in casing and separator policy. normalize()
     * feeds the persisted dedup hashes, so the table must never fork.
     */
    public static function foldAccents(string $text): string
    {
        return strtr(mb_strtoupper($text), [
            'É' => 'E', 'È' => 'E', 'Ê' => 'E', 'Ë' => 'E',
            'À' => 'A', 'Â' => 'A', 'Î' => 'I', 'Ï' => 'I',
            'Ô' => 'O', 'Û' => 'U', 'Ù' => 'U', 'Ü' => 'U',
            'Ç' => 'C', 'Œ' => 'OE',
        ]);
    }

    public static function normalize(string $text): string
    {
        return preg_replace('/[^A-Z0-9]+/', '', self::foldAccents($text)) ?? '';
    }

    /**
     * The needle an invoice number becomes, or null when it is too slight to
     * search for — a bare "7" would match half the labels on any statement.
     */
    public static function invoiceNeedle(?string $number): ?string
    {
        if ($number === null) {
            return null;
        }

        $needle = self::normalize($number);

        if (strlen($needle) < 4 || preg_match('/[0-9]/', $needle) !== 1) {
            return null;
        }

        return $needle;
    }

    /**
     * The needle a client name becomes: legal forms are dropped because banks
     * spell them inconsistently ("CALLISTO SA" vs "CALLISTO"), and short
     * remainders are refused for the same reason short invoice numbers are.
     */
    public static function clientNeedle(string $name): ?string
    {
        $needle = self::normalize($name);

        foreach (self::LEGAL_FORMS as $legalForm) {
            if (str_ends_with($needle, $legalForm) && strlen($needle) > strlen($legalForm)) {
                $needle = substr($needle, 0, -strlen($legalForm));

                break;
            }
        }

        return strlen($needle) < 4 ? null : $needle;
    }
}
