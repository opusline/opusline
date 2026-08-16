<?php

declare(strict_types=1);

use App\Domain\Bank\Actions\NormalizeBankText;

test('normalizes to the uppercase alphanumeric space bank labels live in', function (string $raw, string $expected): void {
    expect(NormalizeBankText::normalize($raw))->toBe($expected);
})->with([
    'invoice number' => ['F-2026-041', 'F2026041'],
    'bank label' => ['VIR SEPA CALLISTO SA · REF F2026041', 'VIRSEPACALLISTOSAREFF2026041'],
    'accents and case' => ['Ateliers Ruche · Séminaire août', 'ATELIERSRUCHESEMINAIREAOUT'],
    'punctuation only' => ['--- ///', ''],
]);

test('turns invoice numbers into needles only when they can identify anything', function (?string $number, ?string $expected): void {
    expect(NormalizeBankText::invoiceNeedle($number))->toBe($expected);
})->with([
    'usual format' => ['2026-041', '2026041'],
    'prefixed format' => ['F-2026-041', 'F2026041'],
    'no number yet' => [null, null],
    'too short' => ['7', null],
    'no digit' => ['BROUILLON', null],
]);

test('turns client names into needles with legal forms dropped', function (string $name, ?string $expected): void {
    expect(NormalizeBankText::clientNeedle($name))->toBe($expected);
})->with([
    'plain name' => ['Nordlys', 'NORDLYS'],
    'sa suffix' => ['Callisto SA', 'CALLISTO'],
    'sarl suffix' => ['Vesterhus SARL', 'VESTERHUS'],
    'sasu suffix' => ['Lunaprint SASU', 'LUNAPRINT'],
    'name that is only a legal form stays itself' => ['SASU', 'SASU'],
    'too short once stripped' => ['Zut SARL', null],
]);
