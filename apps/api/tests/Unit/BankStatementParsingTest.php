<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankStatementFormat;
use App\Domain\Bank\Parsing\ParseBankStatement;
use App\Domain\Bank\Parsing\StatementParseException;

test('detects the format from content, never from the file name', function (string $fixture, BankStatementFormat $expected): void {
    [, $format] = (new ParseBankStatement)->handle(bankFixture($fixture));

    expect($format)->toBe($expected);
})->with([
    'semicolon csv' => ['semicolon_solde.csv', BankStatementFormat::Csv],
    'sgml ofx' => ['statement_v102.ofx', BankStatementFormat::Ofx],
    'xml ofx' => ['statement_v211.ofx', BankStatementFormat::Ofx],
    'qif' => ['statement.qif', BankStatementFormat::Qif],
    'camt053' => ['camt053.xml', BankStatementFormat::Camt053],
]);

test('refuses files that are not bank statements', function (string $fixture): void {
    (new ParseBankStatement)->handle(bankFixture($fixture));
})->throws(StatementParseException::class)->with([
    'binary garbage' => ['garbage.bin'],
    'empty file' => ['empty.txt'],
    'csv without a header row' => ['headerless.csv'],
]);

test('reads a semicolon csv with french headers and amounts, oldest first', function (): void {
    [$statement] = (new ParseBankStatement)->handle(bankFixture('semicolon_solde.csv'));

    expect($statement->movements)->toHaveCount(4)
        ->and($statement->movements[0]->bookedOn->toDateString())->toBe('2026-07-15')
        ->and($statement->movements[0]->amountCents)->toBe(-184_800)
        ->and($statement->movements[1]->amountCents)->toBe(1_122_000)
        // The bank listed 31/07 newest-first: the encaissement above the
        // prélèvement means it happened after it — chronologically it is last.
        ->and($statement->movements[2]->amountCents)->toBe(-243_100)
        ->and($statement->movements[3]->label)->toBe('ENCAISSEMENT F-2026-040 NORDLYS')
        ->and($statement->movements[3]->amountCents)->toBe(61_200)
        ->and($statement->periodStart?->toDateString())->toBe('2026-07-15')
        ->and($statement->periodEnd?->toDateString())->toBe('2026-07-31')
        // The Solde column anchors the statement: the chronologically-last
        // row's balance is the closing balance as of that row's date.
        ->and($statement->closingBalanceCents)->toBe(1_482_000)
        ->and($statement->closingBalanceOn?->toDateString())->toBe('2026-07-31');
});

test('reads a comma csv with quoted labels and iso dates', function (): void {
    [$statement] = (new ParseBankStatement)->handle(bankFixture('comma_iso_dates.csv'));

    expect($statement->movements)->toHaveCount(3)
        ->and($statement->movements[2]->label)->toBe('VIREMENT SEPA, ORVELLA STUDIO')
        ->and($statement->movements[2]->amountCents)->toBe(150_000)
        ->and($statement->movements[2]->bookedOn->toDateString())->toBe('2026-08-05')
        ->and($statement->movements[1]->amountCents)->toBe(-4_990);
});

test('reads a débit and crédit column pair and skips filler rows', function (): void {
    [$statement] = (new ParseBankStatement)->handle(bankFixture('split_debit_credit.csv'));

    expect($statement->movements)->toHaveCount(3)
        ->and($statement->movements[0]->amountCents)->toBe(-243_100)
        ->and($statement->movements[1]->amountCents)->toBe(122_400)
        // Shine prints "0,00" in the unused column instead of leaving it empty.
        ->and($statement->movements[2]->amountCents)->toBe(-720)
        // « Solde bancaire » is the balance; « Solde mouvement » is a decoy
        // holding the signed amount and must not be read as one.
        ->and($statement->closingBalanceCents)->toBe(478_580)
        ->and($statement->closingBalanceOn?->toDateString())->toBe('2026-08-06');
});

test('decodes windows-1252 labels to utf-8', function (): void {
    [$statement] = (new ParseBankStatement)->handle(bankFixture('cp1252_labels.csv'));

    expect($statement->movements[0]->label)->toBe('RÈGLEMENT SÉMINAIRE 25 €')
        ->and($statement->movements[0]->amountCents)->toBe(-12_000);
});

test('reads sgml ofx transactions, fitids and the ledger balance', function (): void {
    [$statement] = (new ParseBankStatement)->handle(bankFixture('statement_v102.ofx'));

    expect($statement->movements)->toHaveCount(2)
        ->and($statement->movements[1]->bookedOn->toDateString())->toBe('2026-08-08')
        ->and($statement->movements[1]->amountCents)->toBe(1_254_000)
        ->and($statement->movements[1]->label)->toBe('VIR SEPA CALLISTO SA · REF F2026041')
        ->and($statement->movements[1]->fitid)->toBe('2026080801')
        ->and($statement->movements[0]->amountCents)->toBe(-243_100)
        ->and($statement->closingBalanceCents)->toBe(1_482_000)
        ->and($statement->closingBalanceOn?->toDateString())->toBe('2026-08-10')
        ->and($statement->periodStart?->toDateString())->toBe('2026-08-01')
        ->and($statement->periodEnd?->toDateString())->toBe('2026-08-10')
        ->and($statement->currency)->toBe('EUR');
});

test('reads xml ofx with timezone-suffixed dates', function (): void {
    [$statement] = (new ParseBankStatement)->handle(bankFixture('statement_v211.ofx'));

    expect($statement->movements)->toHaveCount(1)
        ->and($statement->movements[0]->bookedOn->toDateString())->toBe('2026-07-22')
        ->and($statement->movements[0]->amountCents)->toBe(1_122_000)
        ->and($statement->closingBalanceCents)->toBe(1_663_900);
});

test('reads qif records with a proven day-first convention', function (): void {
    [$statement] = (new ParseBankStatement)->handle(bankFixture('statement.qif'));

    expect($statement->movements)->toHaveCount(3)
        ->and($statement->movements[2]->bookedOn->toDateString())->toBe('2026-07-31')
        ->and($statement->movements[2]->label)->toBe('ENCAISSEMENT NORDLYS · F-2026-040')
        ->and($statement->movements[2]->amountCents)->toBe(61_200)
        ->and($statement->periodStart?->toDateString())->toBe('2026-07-22')
        ->and($statement->periodEnd?->toDateString())->toBe('2026-07-31');
});

test('defaults ambiguous qif dates to day-first', function (): void {
    [$statement] = (new ParseBankStatement)->handle(bankFixture('ambiguous_dates.qif'));

    expect($statement->movements[0]->bookedOn->toDateString())->toBe('2026-02-01')
        ->and($statement->movements[1]->bookedOn->toDateString())->toBe('2026-04-03');
});

test('reads camt053 entries, the closing balance and the period', function (): void {
    [$statement] = (new ParseBankStatement)->handle(bankFixture('camt053.xml'));

    expect($statement->movements)->toHaveCount(2)
        ->and($statement->movements[1]->bookedOn->toDateString())->toBe('2026-08-08')
        ->and($statement->movements[1]->amountCents)->toBe(1_254_000)
        ->and($statement->movements[1]->label)->toBe('VIR SEPA CALLISTO SA · REF F2026041')
        ->and($statement->movements[1]->fitid)->toBe('REF-2026080801')
        ->and($statement->movements[0]->amountCents)->toBe(-243_100)
        ->and($statement->movements[0]->label)->toBe('PRLV URSSAF')
        ->and($statement->closingBalanceCents)->toBe(1_482_000)
        ->and($statement->closingBalanceOn?->toDateString())->toBe('2026-08-10')
        ->and($statement->periodStart?->toDateString())->toBe('2026-08-01')
        ->and($statement->periodEnd?->toDateString())->toBe('2026-08-10')
        ->and($statement->currency)->toBe('EUR');
});
