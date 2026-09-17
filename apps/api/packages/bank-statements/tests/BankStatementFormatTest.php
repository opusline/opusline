<?php

declare(strict_types=1);

use Opusline\BankStatements\BankStatementFormat;

test('keeps the format values consumers store', function (): void {
    expect(array_column(BankStatementFormat::cases(), 'value', 'name'))
        ->toBe(['Csv' => 0, 'Ofx' => 1, 'Qif' => 2, 'Camt053' => 3]);
});
