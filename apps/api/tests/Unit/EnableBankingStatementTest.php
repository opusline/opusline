<?php

declare(strict_types=1);

use App\Domain\Bank\EnableBanking\BankSyncFailed;
use App\Domain\Bank\EnableBanking\EnableBankingStatement;
use App\Domain\Bank\Enums\BankSyncError;
use App\Domain\Bank\Parsing\ParsedMovement;

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function bookedTransaction(array $overrides = []): array
{
    return array_replace([
        'entry_reference' => 'E-1',
        'transaction_amount' => ['currency' => 'EUR', 'amount' => '120.00'],
        'credit_debit_indicator' => 'CRDT',
        'status' => 'BOOK',
        'booking_date' => '2026-08-10',
    ], $overrides);
}

/**
 * @param  list<array<string, mixed>>  $transactions
 */
function onlyMovement(array $transactions): ParsedMovement
{
    $movements = EnableBankingStatement::movements($transactions, 'EUR', 'account-hash');

    expect($movements)->toHaveCount(1);

    return $movements[0];
}

/**
 * @param  array<string, mixed>  $overrides
 */
function expectUnreadableMovement(array $overrides, BankSyncError $reason = BankSyncError::Unavailable): void
{
    expect(fn (): array => EnableBankingStatement::movements([bookedTransaction($overrides)], 'EUR', 'account-hash'))
        ->toThrow(function (BankSyncFailed $failure) use ($reason): void {
            expect($failure->reason)->toBe($reason);
        });
}

test('signs amounts from the credit/debit indicator', function (string $indicator, string $amount, int $cents): void {
    expect(onlyMovement([bookedTransaction([
        'credit_debit_indicator' => $indicator,
        'transaction_amount' => ['currency' => 'EUR', 'amount' => $amount],
    ])])->amountCents)->toBe($cents);
})->with([
    'credit' => ['CRDT', '120.00', 12_000],
    'debit' => ['DBIT', '45.50', -4_550],
    'debit stated negative' => ['DBIT', '-45.50', -4_550],
]);

test('reads dot-decimal amounts exactly', function (string $amount, int $cents): void {
    expect(onlyMovement([bookedTransaction(['transaction_amount' => ['currency' => 'EUR', 'amount' => $amount]])])->amountCents)
        ->toBe($cents);
})->with([
    'one decimal' => ['12.3', 1_230],
    'no decimals' => ['1500', 150_000],
    'cents only' => ['0.05', 5],
    'a zero third decimal' => ['10.500', 1_050],
]);

test('refuses amounts it cannot read to the cent', function (string $amount): void {
    expectUnreadableMovement(['transaction_amount' => ['currency' => 'EUR', 'amount' => $amount]]);
})->with(['below the cent' => ['12.345'], 'comma decimal' => ['1,50'], 'empty' => ['']]);

test('refuses a transaction in another currency', function (): void {
    expectUnreadableMovement(['transaction_amount' => ['currency' => 'USD', 'amount' => '10.00']], BankSyncError::CurrencyMismatch);
});

test('skips what never reached the books', function (string $status): void {
    expect(EnableBankingStatement::movements([bookedTransaction(['status' => $status])], 'EUR', 'account-hash'))->toBe([]);
})->with(['PDNG', 'HOLD', 'SCHD', 'CNCL', 'RJCT']);

test('refuses a transaction whose status says nothing of its booking', function (?string $status): void {
    expectUnreadableMovement(['status' => $status]);
})->with(['missing' => [null], 'unknown to the bank' => ['OTHR']]);

test('dates a movement on its booking day, falling back to the value day', function (): void {
    expect(onlyMovement([bookedTransaction(['booking_date' => '2026-08-10', 'value_date' => '2026-08-12'])])->bookedOn->toDateString())
        ->toBe('2026-08-10')
        ->and(onlyMovement([bookedTransaction(['booking_date' => null, 'value_date' => '2026-08-12'])])->bookedOn->toDateString())
        ->toBe('2026-08-12');
});

test('refuses a transaction without any date', function (): void {
    expectUnreadableMovement(['booking_date' => null]);
});

test('scopes the bank reference to the account and ignores the unstable transaction id', function (): void {
    expect(onlyMovement([bookedTransaction(['entry_reference' => 'E-42', 'transaction_id' => 'T-1'])])->fitid)
        ->toBe('account-hash|E-42')
        ->and(onlyMovement([bookedTransaction(['entry_reference' => null, 'transaction_id' => 'T-1'])])->fitid)
        ->toBeNull();
});

test('labels a movement with its counterparty and remittance', function (array $overrides, string $label): void {
    expect(onlyMovement([bookedTransaction($overrides)])->label)->toBe($label);
})->with([
    'credit names the debtor' => [
        ['debtor' => ['name' => 'NORDLYS SAS'], 'remittance_information' => ['FACTURE F-2026-014']],
        'NORDLYS SAS · FACTURE F-2026-014',
    ],
    'debit names the creditor' => [
        ['credit_debit_indicator' => 'DBIT', 'creditor' => ['name' => 'URSSAF'], 'remittance_information' => ['PRLV', 'T3 2026']],
        'URSSAF · PRLV T3 2026',
    ],
    'no repeated name' => [
        ['debtor' => ['name' => 'Nordlys'], 'remittance_information' => ['VIR NORDLYS SAS']],
        'VIR NORDLYS SAS',
    ],
    'transaction code as last resort' => [
        ['bank_transaction_code' => ['description' => 'Frais de tenue de compte']],
        'Frais de tenue de compte',
    ],
    'nothing to say' => [[], '-'],
]);

test('returns movements oldest first', function (): void {
    $movements = EnableBankingStatement::movements([
        bookedTransaction(['entry_reference' => 'E-2', 'booking_date' => '2026-08-12']),
        bookedTransaction(['entry_reference' => 'E-1', 'booking_date' => '2026-08-10']),
    ], 'EUR', 'account-hash');

    expect(array_map(fn (ParsedMovement $movement): string => $movement->bookedOn->toDateString(), $movements))
        ->toBe(['2026-08-10', '2026-08-12']);
});

test('takes the closing booked balance before the interim one', function (): void {
    $balance = EnableBankingStatement::closingBalance([
        ['balance_type' => 'ITBD', 'balance_amount' => ['currency' => 'EUR', 'amount' => '900.00'], 'reference_date' => '2026-08-13'],
        ['balance_type' => 'CLBD', 'balance_amount' => ['currency' => 'EUR', 'amount' => '-250.40'], 'reference_date' => '2026-08-12'],
    ], 'EUR');

    expect($balance['cents'])->toBe(-25_040)
        ->and($balance['on']?->toDateString())->toBe('2026-08-12');
});

test('ignores available balances, which count pending payments', function (): void {
    expect(EnableBankingStatement::closingBalance([
        ['balance_type' => 'ITAV', 'balance_amount' => ['currency' => 'EUR', 'amount' => '900.00']],
        ['balance_type' => 'CLAV', 'balance_amount' => ['currency' => 'EUR', 'amount' => '950.00']],
    ], 'EUR'))->toBeNull();
});

test('leaves out a balance that says no day', function (): void {
    expect(EnableBankingStatement::closingBalance([
        ['balance_type' => 'CLBD', 'balance_amount' => ['currency' => 'EUR', 'amount' => '900.00']],
    ], 'EUR'))->toBeNull();
});
