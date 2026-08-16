<?php

declare(strict_types=1);

namespace App\Domain\Bank\Parsing;

use Carbon\CarbonImmutable;

/**
 * Reads OFX 1.x (SGML) and 2.x (XML) with one tolerant tag scanner: a value is
 * whatever sits between <TAG> and the next "<". OFX 1.x rarely closes its
 * tags, and 2.x's closing tags are just more "<", so both fall out of the same
 * rule without a real SGML/XML parser.
 */
final class OfxStatementParser implements StatementParser
{
    public function parse(string $text): ParsedStatement
    {
        $blocks = $this->transactionBlocks($text);

        if ($blocks === []) {
            throw new StatementParseException('bank.no_movements');
        }

        $movements = [];

        foreach ($blocks as $block) {
            $posted = $this->value($block, 'DTPOSTED');
            $amount = $this->value($block, 'TRNAMT');

            if ($posted === null || $amount === null) {
                throw new StatementParseException('bank.unreadable_file');
            }

            $movements[] = new ParsedMovement(
                bookedOn: $this->parseOfxDate($posted),
                label: $this->labelOf($block),
                amountCents: AmountParser::toCents($amount),
                fitid: $this->value($block, 'FITID'),
            );
        }

        [$closingBalanceCents, $closingBalanceOn] = $this->ledgerBalance($text);

        return new ParsedStatement(
            movements: $movements,
            closingBalanceCents: $closingBalanceCents,
            closingBalanceOn: $closingBalanceOn,
            periodStart: $this->dateValue($text, 'DTSTART'),
            periodEnd: $this->dateValue($text, 'DTEND'),
            currency: $this->currencyOf($text),
        );
    }

    /**
     * @return list<string>
     */
    private function transactionBlocks(string $text): array
    {
        $pieces = preg_split('/<STMTTRN>/i', $this->firstStatementSection($text));

        if ($pieces === false || count($pieces) < 2) {
            return [];
        }

        return array_map(
            static function (string $piece): string {
                $end = stripos($piece, '</STMTTRN>');

                if ($end === false) {
                    $end = stripos($piece, '</BANKTRANLIST>');
                }

                return $end === false ? $piece : substr($piece, 0, $end);
            },
            array_slice($pieces, 1),
        );
    }

    /**
     * A multi-account file repeats <STMTRS> (or <CCSTMTRS>) sections, and the
     * balance, period and currency are all read first-occurrence — so the
     * movements must come from that same first section, not from every
     * account in the file. Aggregate tags close even in OFX 1.x SGML; a file
     * without the section stays whole, as before.
     */
    private function firstStatementSection(string $text): string
    {
        if (preg_match('/<((?:CC)?STMTRS)>.*?<\/\1>/is', $text, $matches) === 1) {
            return $matches[0];
        }

        return $text;
    }

    private function value(string $block, string $tag): ?string
    {
        if (preg_match('/<'.$tag.'>([^<\r\n]*)/i', $block, $matches) !== 1) {
            return null;
        }

        $value = trim($matches[1]);

        return $value === '' ? null : $value;
    }

    private function labelOf(string $block): string
    {
        return StatementLabel::compose(
            $this->value($block, 'NAME'),
            $this->value($block, 'MEMO'),
        );
    }

    /**
     * @return array{0: ?int, 1: ?CarbonImmutable}
     */
    private function ledgerBalance(string $text): array
    {
        $at = stripos($text, '<LEDGERBAL>');

        if ($at === false) {
            return [null, null];
        }

        $section = substr($text, $at);
        $amount = $this->value($section, 'BALAMT');
        $asOf = $this->value($section, 'DTASOF');

        return [
            $amount === null ? null : AmountParser::toCents($amount),
            $asOf === null ? null : $this->parseOfxDate($asOf),
        ];
    }

    private function dateValue(string $text, string $tag): ?CarbonImmutable
    {
        $value = $this->value($text, $tag);

        return $value === null ? null : $this->parseOfxDate($value);
    }

    private function currencyOf(string $text): ?string
    {
        $code = $this->value($text, 'CURDEF');

        if ($code === null || preg_match('/^[A-Za-z]{3}$/', $code) !== 1) {
            return null;
        }

        return mb_strtoupper($code);
    }

    /** OFX dates open with YYYYMMDD; anything after (time, zone) is noise here. */
    private function parseOfxDate(string $value): CarbonImmutable
    {
        if (preg_match('/^(\d{4})(\d{2})(\d{2})/', trim($value), $parts) !== 1) {
            throw new StatementParseException('bank.unreadable_file');
        }

        return StatementDate::fromParts((int) $parts[1], (int) $parts[2], (int) $parts[3]);
    }
}
