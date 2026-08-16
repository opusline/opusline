<?php

declare(strict_types=1);

namespace App\Domain\Bank\Parsing;

use App\Domain\Bank\Enums\BankStatementFormat;
use Throwable;

/**
 * The single door for statement files: decode bytes, sniff the format from
 * content (extensions lie — banks serve OFX as .txt), delegate to the format's
 * parser, and refuse anything unreadable with a translatable exception before
 * a byte reaches the database.
 */
class ParseBankStatement
{
    /**
     * @return array{0: ParsedStatement, 1: BankStatementFormat}
     *
     * @throws StatementParseException
     */
    public function handle(string $bytes): array
    {
        $text = DecodeStatementText::decode($bytes);
        $format = $this->detectFormat($text);

        try {
            $statement = $this->parserFor($format)->parse($text);
        } catch (StatementParseException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            // Anything a malformed file makes a parser throw is the same fact:
            // the file is not a statement we can read. Surface it as such —
            // chained, so a genuine parser bug keeps its trail.
            throw new StatementParseException('bank.unreadable_file', 0, $exception);
        }

        if ($statement->movements === []) {
            throw new StatementParseException('bank.no_movements');
        }

        $movements = $this->chronological($statement->movements);
        $first = $movements[0];
        $last = $movements[count($movements) - 1];

        // A file with a per-row balance column anchors itself: the last row's
        // balance is the statement's closing balance as of that row's date.
        // Files that state no period get the span their movements cover.
        $selfAnchored = $statement->closingBalanceCents === null && $last->balanceAfter !== null;

        return [
            new ParsedStatement(
                movements: $movements,
                closingBalanceCents: $selfAnchored ? $last->balanceAfter : $statement->closingBalanceCents,
                closingBalanceOn: $selfAnchored ? $last->bookedOn : $statement->closingBalanceOn,
                periodStart: $statement->periodStart ?? $first->bookedOn,
                periodEnd: $statement->periodEnd ?? $last->bookedOn,
                currency: $statement->currency,
            ),
            $format,
        ];
    }

    /**
     * Movements leave here oldest first, whichever way the bank listed them.
     * A newest-first file is flipped whole rather than sorted, so the bank's
     * own within-a-day sequence survives — running balances depend on it.
     *
     * @param  non-empty-list<ParsedMovement>  $movements
     * @return non-empty-list<ParsedMovement>
     */
    private function chronological(array $movements): array
    {
        $last = count($movements) - 1;

        if ($last > 0 && $movements[0]->bookedOn->greaterThan($movements[$last]->bookedOn)) {
            $movements = array_reverse($movements);
        }

        usort(
            $movements,
            static fn (ParsedMovement $a, ParsedMovement $b): int => $a->bookedOn->getTimestamp() <=> $b->bookedOn->getTimestamp(),
        );

        return $movements;
    }

    private function detectFormat(string $text): BankStatementFormat
    {
        $head = mb_strtoupper(mb_substr(ltrim($text), 0, 4096));

        if (str_contains($head, 'OFXHEADER') || str_contains($head, '<OFX')) {
            return BankStatementFormat::Ofx;
        }

        if (str_contains($head, '<BKTOCSTMRSTMT') || str_contains($head, 'CAMT.053')) {
            return BankStatementFormat::Camt053;
        }

        if (str_contains($head, '!TYPE:')) {
            return BankStatementFormat::Qif;
        }

        return BankStatementFormat::Csv;
    }

    private function parserFor(BankStatementFormat $format): StatementParser
    {
        return match ($format) {
            BankStatementFormat::Csv => new CsvStatementParser,
            BankStatementFormat::Ofx => new OfxStatementParser,
            BankStatementFormat::Qif => new QifStatementParser,
            BankStatementFormat::Camt053 => new Camt053StatementParser,
        };
    }
}
