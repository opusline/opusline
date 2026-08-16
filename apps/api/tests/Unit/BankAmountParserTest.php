<?php

declare(strict_types=1);

use App\Domain\Bank\Parsing\AmountParser;
use App\Domain\Bank\Parsing\StatementParseException;

test('reads bank amount notations as signed cents', function (string $raw, int $expectedCents): void {
    expect(AmountParser::toCents($raw))->toBe($expectedCents);
})->with([
    'french decimal comma' => ['1234,56', 123_456],
    'french thousands space' => ['1 234,56', 123_456],
    'french narrow no-break space' => ["12\u{202F}540,00", 1_254_000],
    'french thousands dot' => ['1.234,56', 123_456],
    'international' => ['1,234.56', 123_456],
    'plain dot decimal' => ['1234.56', 123_456],
    'ofx signed' => ['-2431.00', -243_100],
    'explicit plus' => ['+612,00', 61_200],
    'unicode minus' => ["\u{2212}12,34", -1_234],
    'trailing minus' => ['12,34-', -1_234],
    'accounting parentheses' => ['(45,00)', -4_500],
    'single decimal digit' => ['-12,3', -1_230],
    'no decimals' => ['765', 76_500],
    'lone thousands dot' => ['1.234', 123_400],
    'lone thousands comma' => ['12,345', 1_234_500],
    'repeated thousands dots' => ['1.234.567', 123_456_700],
    'euro sign' => ['612,00 €', 61_200],
    'currency code prefix' => ['EUR 612,00', 61_200],
]);

test('refuses what it cannot read exactly', function (string $raw): void {
    AmountParser::toCents($raw);
})->throws(StatementParseException::class)->with([
    'empty' => [''],
    'letters' => ['douze'],
    'three decimals' => ['12,3456'],
    'doubled sign' => ['--12'],
    'malformed thousands groups' => ['12.34.56'],
    'oversized leading group' => ['1234.567.890'],
]);
