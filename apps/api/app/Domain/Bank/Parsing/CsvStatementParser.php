<?php

declare(strict_types=1);

namespace App\Domain\Bank\Parsing;

use App\Domain\Bank\Actions\NormalizeBankText;
use Carbon\CarbonImmutable;

/**
 * Reads the CSV dialects French banks actually export: any of the usual
 * delimiters, a header row naming the columns in the bank's own words, dates
 * in French or ISO order, amounts in French or international notation, and
 * either a single signed amount column or a débit/crédit pair.
 *
 * A file without a recognizable header row is refused rather than guessed at —
 * column order varies too much across banks for positional parsing to be safe.
 */
final class CsvStatementParser implements StatementParser
{
    private const array DELIMITERS = [';', ',', "\t", '|'];

    /** Ordered by preference: the operation date over the value date. */
    private const array DATE_ALIASES = [
        'date operation',
        'date d operation',
        'date de l operation',
        'date comptable',
        'booking date',
        'transaction date',
        'date',
        'date valeur',
    ];

    private const array LABEL_ALIASES = [
        'libelle',
        'label',
        'description',
        'motif',
        'communication',
        'intitule',
        'nature',
        'operation',
        'memo',
    ];

    private const array AMOUNT_ALIASES = ['montant', 'amount'];

    private const array CURRENCY_ALIASES = ['devise', 'currency', 'monnaie'];

    /**
     * The bank's own running balance column. The bare « solde » alias matches
     * exactly, never by prefix: Shine ships a « Solde mouvement » column that
     * holds the signed amount, not a balance.
     */
    private const array BALANCE_PREFIX_ALIASES = ['solde bancaire', 'balance'];

    private const array BALANCE_EXACT_ALIASES = ['solde'];

    public function parse(string $text): ParsedStatement
    {
        $lines = $this->contentLines($text);

        if (count($lines) < 2) {
            throw new StatementParseException('bank.unreadable_file');
        }

        $delimiter = $this->sniffDelimiter($lines);
        $header = array_map($this->normalizeHeaderCell(...), str_getcsv($lines[0], $delimiter, escape: '\\'));
        $columns = $this->mapColumns($header);

        $movements = [];
        $currency = null;

        foreach (array_slice($lines, 1) as $line) {
            $cells = str_getcsv($line, $delimiter, escape: '\\');
            $movement = $this->movementFromRow($cells, $columns);

            if (! $movement instanceof ParsedMovement) {
                continue;
            }

            $movements[] = $movement;
            $currency = $this->trackCurrency($currency, $cells, $columns['currency']);
        }

        return new ParsedStatement(
            movements: $movements,
            currency: $currency,
        );
    }

    /**
     * @return list<string>
     */
    private function contentLines(string $text): array
    {
        $lines = preg_split('/\r\n|\r|\n/', $text);

        if ($lines === false) {
            throw new StatementParseException('bank.unreadable_file');
        }

        return array_values(array_filter($lines, static fn (string $line): bool => trim($line) !== ''));
    }

    /**
     * The delimiter that splits the most lines into the same number of columns.
     *
     * @param  list<string>  $lines
     */
    private function sniffDelimiter(array $lines): string
    {
        $sample = array_slice($lines, 0, 10);
        $best = null;
        $bestScore = 0;

        foreach (self::DELIMITERS as $delimiter) {
            $counts = array_map(
                static fn (string $line): int => count(str_getcsv($line, $delimiter, escape: '\\')),
                $sample,
            );

            if ($counts === []) {
                continue;
            }

            $columns = min($counts);
            if ($columns < 2) {
                continue;
            }
            if ($columns !== max($counts)) {
                continue;
            }

            if ($columns > $bestScore) {
                $bestScore = $columns;
                $best = $delimiter;
            }
        }

        if ($best === null) {
            throw new StatementParseException('bank.unreadable_file');
        }

        return $best;
    }

    private function normalizeHeaderCell(?string $cell): string
    {
        $normalized = mb_strtolower(NormalizeBankText::foldAccents(trim($cell ?? '')));

        return trim(preg_replace('/[^a-z0-9]+/', ' ', $normalized) ?? '');
    }

    /**
     * @param  list<string>  $header
     * @return array{date: int, label: ?int, amount: ?int, debit: ?int, credit: ?int, currency: ?int, balance: ?int}
     */
    private function mapColumns(array $header): array
    {
        $used = [];
        $date = $this->matchColumn($header, self::DATE_ALIASES, $used);

        if ($date === null) {
            throw new StatementParseException('bank.unreadable_file');
        }

        $used[] = $date;

        // A débit/crédit pair wins over a single column: banks that split also
        // tend to name the pair "montant débit"/"montant crédit", which a bare
        // "montant" match would grab half of.
        $debit = $this->matchColumnContaining($header, 'debit', $used);
        $credit = $this->matchColumnContaining($header, 'credit', $used);

        if ($debit === null || $credit === null) {
            $debit = null;
            $credit = null;
        } else {
            $used[] = $debit;
            $used[] = $credit;
        }

        $amount = $debit === null ? $this->matchColumn($header, self::AMOUNT_ALIASES, $used) : null;

        if ($amount !== null) {
            $used[] = $amount;
        }

        if ($amount === null && $debit === null) {
            throw new StatementParseException('bank.unreadable_file');
        }

        $label = $this->matchColumn($header, self::LABEL_ALIASES, $used);

        if ($label !== null) {
            $used[] = $label;
        }

        return [
            'date' => $date,
            'label' => $label,
            'amount' => $amount,
            'debit' => $debit,
            'credit' => $credit,
            'currency' => $this->matchColumn($header, self::CURRENCY_ALIASES, $used),
            'balance' => $this->matchBalanceColumn($header, $used),
        ];
    }

    /**
     * @param  list<string>  $header
     * @param  list<string>  $aliases
     * @param  list<int>  $used
     */
    private function matchColumn(array $header, array $aliases, array $used): ?int
    {
        foreach ($aliases as $alias) {
            foreach ($header as $index => $cell) {
                if (! in_array($index, $used, true) && str_starts_with($cell, $alias)) {
                    return $index;
                }
            }
        }

        return null;
    }

    /**
     * @param  list<string>  $header
     * @param  list<int>  $used
     */
    private function matchBalanceColumn(array $header, array $used): ?int
    {
        $byPrefix = $this->matchColumn($header, self::BALANCE_PREFIX_ALIASES, $used);

        if ($byPrefix !== null) {
            return $byPrefix;
        }

        foreach ($header as $index => $cell) {
            if (! in_array($index, $used, true) && in_array($cell, self::BALANCE_EXACT_ALIASES, true)) {
                return $index;
            }
        }

        return null;
    }

    /**
     * @param  list<string>  $header
     * @param  list<int>  $used
     */
    private function matchColumnContaining(array $header, string $needle, array $used): ?int
    {
        foreach ($header as $index => $cell) {
            if (! in_array($index, $used, true) && str_contains($cell, $needle)) {
                return $index;
            }
        }

        return null;
    }

    /**
     * @param  list<?string>  $cells
     * @param  array{date: int, label: ?int, amount: ?int, debit: ?int, credit: ?int, currency: ?int, balance: ?int}  $columns
     */
    private function movementFromRow(array $cells, array $columns): ?ParsedMovement
    {
        $date = $this->cellAt($cells, $columns['date']);
        $amountCents = $this->amountOf($cells, $columns);

        // Banks pad exports with subtotal, carriage or "solde initial" lines;
        // a row without an amount is one of those, not a movement.
        if ($amountCents === null) {
            return null;
        }

        if ($date === '') {
            throw new StatementParseException('bank.unreadable_file');
        }

        return new ParsedMovement(
            bookedOn: $this->parseDate($date),
            label: $this->cellAt($cells, $columns['label']),
            amountCents: $amountCents,
            balanceAfter: $this->balanceOf($cells, $columns['balance']),
        );
    }

    /**
     * The balance column is auxiliary — a cell this parser cannot read makes
     * the balance unknown, not the whole statement unreadable.
     *
     * @param  list<?string>  $cells
     */
    private function balanceOf(array $cells, ?int $column): ?int
    {
        $raw = $this->cellAt($cells, $column);

        if ($raw === '') {
            return null;
        }

        try {
            return AmountParser::toCents($raw);
        } catch (StatementParseException) {
            return null;
        }
    }

    /**
     * @param  list<?string>  $cells
     */
    private function cellAt(array $cells, ?int $index): string
    {
        return $index === null ? '' : trim($cells[$index] ?? '');
    }

    /**
     * @param  list<?string>  $cells
     * @param  array{date: int, label: ?int, amount: ?int, debit: ?int, credit: ?int, currency: ?int, balance: ?int}  $columns
     */
    private function amountOf(array $cells, array $columns): ?int
    {
        if ($columns['amount'] !== null) {
            $raw = $this->cellAt($cells, $columns['amount']);

            return $raw === '' ? null : AmountParser::toCents($raw);
        }

        $debit = $this->cellAt($cells, $columns['debit']);
        $credit = $this->cellAt($cells, $columns['credit']);

        // Some banks leave the unused side empty, others (Shine) print "0,00"
        // in it — zero and absent both mean "the amount is in the other column".
        $creditCents = $credit === '' ? 0 : abs(AmountParser::toCents($credit));
        $debitCents = $debit === '' ? 0 : abs(AmountParser::toCents($debit));

        if ($creditCents !== 0) {
            return $creditCents;
        }

        return $debitCents === 0 ? null : -$debitCents;
    }

    /**
     * A statement is denominated in one currency; rows disagreeing on the
     * code mean the file cannot be imported as a single account's history.
     *
     * @param  list<?string>  $cells
     */
    private function trackCurrency(?string $seen, array $cells, ?int $column): ?string
    {
        if ($column === null) {
            return $seen;
        }

        $code = mb_strtoupper($this->cellAt($cells, $column));

        if (preg_match('/^[A-Z]{3}$/', $code) !== 1) {
            return $seen;
        }

        if ($seen !== null && $code !== $seen) {
            throw new StatementParseException('bank.unreadable_file');
        }

        return $code;
    }

    private function parseDate(string $value): CarbonImmutable
    {
        $patterns = [
            '#^(?<d>\d{1,2})/(?<m>\d{1,2})/(?<y>\d{4})$#',
            '#^(?<d>\d{1,2})/(?<m>\d{1,2})/(?<y2>\d{2})$#',
            '#^(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})$#',
            '#^(?<d>\d{1,2})-(?<m>\d{1,2})-(?<y>\d{4})$#',
            '#^(?<d>\d{1,2})\.(?<m>\d{1,2})\.(?<y>\d{4})$#',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $value, $parts) === 1) {
                $year = isset($parts['y2']) ? 2000 + (int) $parts['y2'] : (int) $parts['y'];

                return StatementDate::fromParts($year, (int) $parts['m'], (int) $parts['d']);
            }
        }

        throw new StatementParseException('bank.unreadable_file');
    }
}
