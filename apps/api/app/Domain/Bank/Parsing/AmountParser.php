<?php

declare(strict_types=1);

namespace App\Domain\Bank\Parsing;

/**
 * Turns the amount notations found in bank exports into signed integer cents
 * without ever going through a float: "1 234,56", "1.234,56", "1,234.56",
 * "-12,3", "1234.56", "(45,00)". Throws on anything it cannot read exactly.
 */
final class AmountParser
{
    public static function toCents(string $raw): int
    {
        $value = trim($raw);
        $value = str_replace(["\u{2212}", "\u{00A0}", "\u{202F}", ' ', '€', '$', '£'], ['-', '', '', '', '', '', ''], $value);
        $value = preg_replace('/^[A-Za-z]{3}|[A-Za-z]{3}$/', '', $value) ?? $value;
        $value = trim($value);

        $negative = false;

        if (str_starts_with($value, '(') && str_ends_with($value, ')')) {
            $negative = true;
            $value = substr($value, 1, -1);
        }

        if (str_starts_with($value, '-')) {
            $negative = true;
            $value = substr($value, 1);
        } elseif (str_starts_with($value, '+')) {
            $value = substr($value, 1);
        }

        if (str_ends_with($value, '-')) {
            $negative = true;
            $value = substr($value, 0, -1);
        }

        $value = trim($value);

        if ($value === '' || preg_match('/^[0-9.,]+$/', $value) !== 1) {
            throw new StatementParseException('bank.unreadable_file');
        }

        [$integerPart, $decimalPart] = self::splitDecimal($value);

        if ($integerPart === '' || preg_match('/^[0-9]*$/', $integerPart) !== 1) {
            throw new StatementParseException('bank.unreadable_file');
        }

        $cents = ((int) $integerPart) * 100 + self::centsOf($decimalPart);

        return $negative ? -$cents : $cents;
    }

    /**
     * @return array{0: string, 1: string}
     */
    private static function splitDecimal(string $value): array
    {
        $lastComma = strrpos($value, ',');
        $lastDot = strrpos($value, '.');

        if ($lastComma === false && $lastDot === false) {
            return [$value, ''];
        }

        // Both present: the rightmost is the decimal mark, the other groups thousands.
        if ($lastComma !== false && $lastDot !== false) {
            $decimalAt = max($lastComma, $lastDot);

            return [
                str_replace([',', '.'], '', substr($value, 0, $decimalAt)),
                substr($value, $decimalAt + 1),
            ];
        }

        $separatorAt = $lastComma !== false ? $lastComma : $lastDot;
        $separator = $value[$separatorAt];

        // Repeated separator can only group thousands ("1.234.567") — and the
        // groups must actually be thousands. "12.34.56" is a malformed amount;
        // silently reading it as 123456 would corrupt money.
        if (substr_count($value, $separator) > 1) {
            $group = preg_quote($separator, '/');

            if (preg_match('/^[0-9]{1,3}(?:'.$group.'[0-9]{3})+$/', $value) !== 1) {
                throw new StatementParseException('bank.unreadable_file');
            }

            return [str_replace($separator, '', $value), ''];
        }

        $trailing = substr($value, $separatorAt + 1);

        // Exactly three trailing digits reads as a thousands group ("1.234",
        // "12,345") — no bank prints three decimal places on a currency amount.
        if (strlen($trailing) === 3) {
            return [str_replace($separator, '', $value), ''];
        }

        return [substr($value, 0, $separatorAt), $trailing];
    }

    private static function centsOf(string $decimalPart): int
    {
        if ($decimalPart === '') {
            return 0;
        }

        if (preg_match('/^[0-9]{1,2}$/', $decimalPart) !== 1) {
            throw new StatementParseException('bank.unreadable_file');
        }

        return (int) str_pad($decimalPart, 2, '0');
    }
}
