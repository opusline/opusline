<?php

declare(strict_types=1);

namespace App\Domain\Bank\Parsing;

use Carbon\CarbonImmutable;

/**
 * Reads QIF: line-oriented records (D date, T/U amount, P payee, M memo)
 * terminated by "^".
 *
 * QIF never says whether 01/02 is the 1st of February or the 2nd of January,
 * so the whole file is scanned first: any day-part above 12 proves the
 * convention; an entirely ambiguous file defaults to day-first, the French
 * export convention.
 */
final class QifStatementParser implements StatementParser
{
    public function parse(string $text): ParsedStatement
    {
        $records = $this->records($text);

        if ($records === []) {
            throw new StatementParseException('bank.no_movements');
        }

        $dayFirst = $this->isDayFirst($records);
        $movements = [];

        foreach ($records as $record) {
            $date = $record['D'] ?? null;
            $amount = $record['T'] ?? $record['U'] ?? null;

            if ($date === null || $amount === null) {
                throw new StatementParseException('bank.unreadable_file');
            }

            $movements[] = new ParsedMovement(
                bookedOn: $this->parseDate($date, $dayFirst),
                label: StatementLabel::compose($record['P'] ?? null, $record['M'] ?? null),
                amountCents: AmountParser::toCents($amount),
            );
        }

        return new ParsedStatement(movements: $movements);
    }

    /**
     * @return list<array<string, string>>
     */
    private function records(string $text): array
    {
        $lines = preg_split('/\r\n|\r|\n/', $text);

        if ($lines === false) {
            throw new StatementParseException('bank.unreadable_file');
        }

        $records = [];
        $current = [];

        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }
            if (str_starts_with($line, '!')) {
                continue;
            }

            if ($line === '^') {
                if ($current !== []) {
                    $records[] = $current;
                }

                $current = [];

                continue;
            }

            $current[strtoupper($line[0])] = trim(substr($line, 1));
        }

        if ($current !== []) {
            $records[] = $current;
        }

        return $records;
    }

    /**
     * @param  list<array<string, string>>  $records
     */
    private function isDayFirst(array $records): bool
    {
        foreach ($records as $record) {
            $parts = $this->dateParts($record['D'] ?? '');

            if ($parts === null) {
                continue;
            }

            if ($parts[0] > 12) {
                return true;
            }

            if ($parts[1] > 12) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return ?array{0: int, 1: int, 2: int}
     */
    private function dateParts(string $value): ?array
    {
        // Quicken writes years past 1999 as "'26"; normalizing the apostrophe
        // to a plain separator makes both spellings one pattern.
        $value = str_replace("'", '/', trim($value));

        if (preg_match('#^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$#', $value, $parts) !== 1) {
            return null;
        }

        $year = (int) $parts[3];

        return [(int) $parts[1], (int) $parts[2], $year < 100 ? 2000 + $year : $year];
    }

    private function parseDate(string $value, bool $dayFirst): CarbonImmutable
    {
        $parts = $this->dateParts($value);

        if ($parts === null) {
            throw new StatementParseException('bank.unreadable_file');
        }

        [$first, $second, $year] = $parts;

        return $dayFirst
            ? StatementDate::fromParts($year, $second, $first)
            : StatementDate::fromParts($year, $first, $second);
    }
}
