<?php

declare(strict_types=1);

use App\Domain\Bank\Actions\ListBankMovements;

function runningBalancesWalk(?int $seed, array $newestFirstCents): array
{
    return ListBankMovements::runningBalances($seed, $newestFirstCents);
}

test('walks a newest-first page backwards from the seed', function (): void {
    $balances = runningBalancesWalk(1_482_000, [1_254_000, -243_100, -184_800]);

    expect($balances)->toBe([1_482_000, 228_000, 471_100]);
});

test('carries balances through negative territory', function (): void {
    $balances = runningBalancesWalk(-6_000, [4_000, 5_000, -30_000]);

    expect($balances)->toBe([-6_000, -10_000, -15_000]);
});

test('keeps every balance null without a seed', function (): void {
    expect(runningBalancesWalk(null, [50_000, -20_000]))->toBe([null, null]);
});

test('returns an empty list for no movements', function (): void {
    expect(runningBalancesWalk(100, []))->toBe([]);
});
