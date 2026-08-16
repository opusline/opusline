<?php

declare(strict_types=1);

namespace App\Domain\Bank\Parsing;

use Carbon\CarbonImmutable;
use SimpleXMLElement;

/**
 * Reads CAMT.053 (ISO 20022 bank-to-customer statement): the first <Stmt> of
 * the document, its CLBD (closing booked) balance, its period, and every
 * <Ntry> as a movement. Amounts are ISO dot-decimal; DBIT entries negate.
 */
final class Camt053StatementParser implements StatementParser
{
    public function parse(string $text): ParsedStatement
    {
        $statement = $this->firstStatement($text);

        $movements = [];

        foreach ($statement->xpath('c:Ntry') ?: [] as $entry) {
            $movements[] = $this->movementFrom($entry);
        }

        [$closingBalanceCents, $closingBalanceOn] = $this->closingBalance($statement);

        return new ParsedStatement(
            movements: $movements,
            closingBalanceCents: $closingBalanceCents,
            closingBalanceOn: $closingBalanceOn,
            periodStart: $this->dateAt($statement, 'c:FrToDt/c:FrDtTm'),
            periodEnd: $this->dateAt($statement, 'c:FrToDt/c:ToDtTm'),
            currency: $this->currencyOf($statement),
        );
    }

    private function firstStatement(string $text): SimpleXMLElement
    {
        $previous = libxml_use_internal_errors(true);

        try {
            $document = simplexml_load_string($text);
        } finally {
            // The buffered parse errors are process-wide state — under Octane
            // they would pile up across requests if left behind.
            libxml_clear_errors();
            libxml_use_internal_errors($previous);
        }

        if ($document === false) {
            throw new StatementParseException('bank.unreadable_file');
        }

        $this->inheritNamespace($document);

        $statements = $document->xpath('//c:BkToCstmrStmt/c:Stmt');

        if (in_array($statements, [false, null, []], true)) {
            throw new StatementParseException('bank.unreadable_file');
        }

        $statement = $statements[0];
        $this->inheritNamespace($statement);

        return $statement;
    }

    private function movementFrom(SimpleXMLElement $entry): ParsedMovement
    {
        $this->inheritNamespace($entry);

        $bookedNode = $this->first($entry, 'c:BookgDt/c:Dt') ?? $this->first($entry, 'c:BookgDt/c:DtTm');
        $cents = $this->signedCents($entry);

        if ($cents === null || ! $bookedNode instanceof SimpleXMLElement) {
            throw new StatementParseException('bank.unreadable_file');
        }

        return new ParsedMovement(
            bookedOn: $this->parseIsoDate((string) $bookedNode),
            label: $this->labelOf($entry),
            amountCents: $cents,
            fitid: $this->text($entry, 'c:AcctSvcrRef') ?? $this->text($entry, 'c:NtryRef'),
        );
    }

    /** The node's Amt as signed cents — DBIT negates; null when Amt is absent. */
    private function signedCents(SimpleXMLElement $node): ?int
    {
        $amountNode = $this->first($node, 'c:Amt');

        if (! $amountNode instanceof SimpleXMLElement) {
            return null;
        }

        $cents = abs(AmountParser::toCents((string) $amountNode));

        return $this->text($node, 'c:CdtDbtInd') === 'DBIT' ? -$cents : $cents;
    }

    private function labelOf(SimpleXMLElement $entry): string
    {
        $unstructured = $entry->xpath('c:NtryDtls/c:TxDtls/c:RmtInf/c:Ustrd');

        if (is_array($unstructured) && $unstructured !== []) {
            $parts = array_map(static fn (SimpleXMLElement $node): string => trim((string) $node), $unstructured);

            return implode(StatementLabel::SEPARATOR, array_filter($parts, static fn (string $part): bool => $part !== ''));
        }

        return $this->text($entry, 'c:AddtlNtryInf') ?? '';
    }

    /**
     * @return array{0: ?int, 1: ?CarbonImmutable}
     */
    private function closingBalance(SimpleXMLElement $statement): array
    {
        foreach ($statement->xpath('c:Bal') ?: [] as $balance) {
            $this->inheritNamespace($balance);

            if ($this->text($balance, 'c:Tp/c:CdOrPrtry/c:Cd') !== 'CLBD') {
                continue;
            }

            $cents = $this->signedCents($balance);

            if ($cents === null) {
                continue;
            }

            $date = $this->text($balance, 'c:Dt/c:Dt') ?? $this->text($balance, 'c:Dt/c:DtTm');

            return [$cents, $date === null ? null : $this->parseIsoDate($date)];
        }

        return [null, null];
    }

    private function currencyOf(SimpleXMLElement $statement): ?string
    {
        $amounts = $statement->xpath('c:Ntry/c:Amt/@Ccy') ?: [];

        foreach ($amounts as $currency) {
            $code = mb_strtoupper(trim((string) $currency));

            if (preg_match('/^[A-Z]{3}$/', $code) === 1) {
                return $code;
            }
        }

        return null;
    }

    private function dateAt(SimpleXMLElement $node, string $path): ?CarbonImmutable
    {
        $value = $this->text($node, $path);

        return $value === null ? null : $this->parseIsoDate($value);
    }

    private function first(SimpleXMLElement $node, string $path): ?SimpleXMLElement
    {
        $this->inheritNamespace($node);
        $matches = $node->xpath($path);

        return is_array($matches) && $matches !== [] ? $matches[0] : null;
    }

    private function text(SimpleXMLElement $node, string $path): ?string
    {
        $match = $this->first($node, $path);

        if (! $match instanceof SimpleXMLElement) {
            return null;
        }

        $value = trim((string) $match);

        return $value === '' ? null : $value;
    }

    /**
     * SimpleXML forgets registered XPath namespaces on nodes returned by
     * xpath(), so every hop re-registers the document namespace — whichever
     * URI the node's namespace declares, default or prefixed alike.
     */
    private function inheritNamespace(SimpleXMLElement $node): void
    {
        $namespaces = $node->getNamespaces();
        $namespace = $namespaces === [] ? '' : reset($namespaces);
        $node->registerXPathNamespace('c', $namespace);
    }

    private function parseIsoDate(string $value): CarbonImmutable
    {
        if (preg_match('/^(\d{4})-(\d{2})-(\d{2})/', trim($value), $parts) !== 1) {
            throw new StatementParseException('bank.unreadable_file');
        }

        return StatementDate::fromParts((int) $parts[1], (int) $parts[2], (int) $parts[3]);
    }
}
