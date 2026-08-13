<?php

declare(strict_types=1);

use App\Domain\Shared\Validation\InvoiceNumberFormat;

test('accepts a format built from the documented tokens', function (string $format): void {
    expect(rejects(new InvoiceNumberFormat, $format))->toBeFalse();
})->with([
    'year and counter' => ['AAAA-NNN'],
    'year, month and counter' => ['AAAAMM-NNN'],
    'counter alone' => ['NNN'],
    'literal prefix' => ['FACT/AAAA/NNN'],
]);

test('rejects a format without a counter', function (string $format): void {
    expect(rejects(new InvoiceNumberFormat, $format))->toBeTrue();
})->with([
    'no counter token' => ['AAAA-MM'],
    'counter welded to a literal' => ['COMMANDENNN'],
]);

test('rejects a format carrying an unknown token', function (mixed $format): void {
    expect(rejects(new InvoiceNumberFormat, $format))->toBeTrue();
})->with([
    'angle brackets' => ['NNN-<client>'],
    'percent placeholder' => ['%Y-NNN'],
    'braces' => ['{year}-NNN'],
    'not a string' => [42],
]);

test('rejects a format with more than one counter', function (string $format): void {
    expect(rejects(new InvoiceNumberFormat, $format))->toBeTrue();
})->with([
    'two counters apart' => ['NNN-NNN'],
    'two counters welded' => ['NNNNNN'],
]);
