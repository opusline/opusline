<?php

declare(strict_types=1);

use App\Domain\Bank\Actions\ResolveBalanceCoverage;
use App\Domain\Bank\Enums\BankBalanceSource;
use Carbon\CarbonImmutable;

function coverage(
    ?string $anchorOn,
    ?string $lastMovementOn,
    BankBalanceSource $source = BankBalanceSource::Statement,
    string $today = '2026-08-21',
): ?string {
    $asOf = $anchorOn === null ? null : CarbonImmutable::parse($anchorOn);

    return (new ResolveBalanceCoverage)->handle(
        $asOf instanceof CarbonImmutable ? [
            'cents' => 1_000_000,
            'source' => $source,
            'asOf' => $asOf,
            // Mirrors ResolveBankBalance: a typed figure is a snapshot from
            // inside its day, a statement close covers the whole of it.
            'coversThrough' => $source === BankBalanceSource::Manual ? $asOf->subDay() : $asOf,
            'citableAsOf' => $source === BankBalanceSource::Derived ? null : $asOf,
        ] : null,
        $lastMovementOn === null ? null : CarbonImmutable::parse($lastMovementOn),
        CarbonImmutable::parse($today),
    )?->toDateString();
}

test('resolves what the balance covers', function (
    ?string $anchorOn,
    ?string $lastMovementOn,
    BankBalanceSource $source,
    ?string $expected,
): void {
    expect(coverage($anchorOn, $lastMovementOn, $source))->toBe($expected);
})->with([
    'a statement close covers its own day' => ['2026-08-20', '2026-08-12', BankBalanceSource::Statement, '2026-08-20'],
    'a typed balance covers only the day before it was read' => ['2026-08-20', null, BankBalanceSource::Manual, '2026-08-19'],
    'a later movement outruns the anchor' => ['2026-08-10', '2026-08-18', BankBalanceSource::Statement, '2026-08-18'],
    'the anchor stands alone when nothing is imported' => ['2026-08-10', null, BankBalanceSource::Statement, '2026-08-10'],
    'a movement dated in the future is clamped to today' => ['2026-08-10', '2026-09-30', BankBalanceSource::Statement, '2026-08-21'],
    'nothing is covered without an anchor' => [null, '2026-08-18', BankBalanceSource::Statement, null],
]);
