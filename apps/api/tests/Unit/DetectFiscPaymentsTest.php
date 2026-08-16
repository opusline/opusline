<?php

declare(strict_types=1);

use App\Domain\Bank\Actions\DetectFiscPayments;

test('recognizes urssaf debits by their label', function (string $label, bool $expected): void {
    expect(DetectFiscPayments::isUrssaf($label))->toBe($expected);
})->with([
    'plain prélèvement' => ['PRLV URSSAF JUILLET', true],
    'regional wording' => ['URSSAF DE POITOU CHARENTES - +REPRESENTATION+UR 547000', true],
    'lowercase accented' => ['Prélèvement Urssaf · juin', true],
    'unrelated transfer' => ['VIR SEPA NORDLYS', false],
    'tva télérèglement is not urssaf' => ['TELEREGLEMENT TVA CA3 JUIN', false],
]);

test('recognizes tva debits by the word, not the letters', function (string $label, bool $expected): void {
    expect(DetectFiscPayments::isVat($label))->toBe($expected);
})->with([
    'télérèglement' => ['TELEREGLEMENT TVA CA3 JUIN', true],
    'lowercase accented' => ['Télérèglement TVA · CA3 juillet', true],
    'letters inside other words' => ['LOYER NUIT VALENCE', false],
    // The DGFiP collects income tax through the same channel — a bare DGFiP
    // debit must not be read as TVA.
    'bare dgfip debit' => ['PRLV DGFIP IMPOT REVENU', false],
    'urssaf prélèvement is not tva' => ['PRLV URSSAF JUILLET', false],
]);
