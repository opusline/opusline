<?php

declare(strict_types=1);

use App\Domain\Bank\Actions\ComputeRunningBalances;
use Carbon\CarbonImmutable;

/**
 * @param  list<array{string, int}>  $movements
 * @return list<array{CarbonImmutable, int}>
 */
function chronologicalMovements(array $movements): array
{
    return array_map(
        static fn (array $movement): array => [CarbonImmutable::parse($movement[0]), $movement[1]],
        $movements,
    );
}

test('walks backwards from an anchor that covers every movement', function (): void {
    $balances = (new ComputeRunningBalances)->handle(1_482_000, CarbonImmutable::parse('2026-08-10'), chronologicalMovements([
        ['2026-08-01', -184_800],
        ['2026-08-05', -243_100],
        ['2026-08-08', 1_254_000],
    ]));

    expect($balances)->toBe([471_100, 228_000, 1_482_000]);
});

test('walks forwards past the anchor date', function (): void {
    $balances = (new ComputeRunningBalances)->handle(100_000, CarbonImmutable::parse('2026-08-01'), chronologicalMovements([
        ['2026-08-01', 50_000],
        ['2026-08-05', -20_000],
        ['2026-08-09', 30_000],
    ]));

    expect($balances)->toBe([100_000, 80_000, 110_000]);
});

test('handles an anchor older than every movement', function (): void {
    $balances = (new ComputeRunningBalances)->handle(100_000, CarbonImmutable::parse('2026-07-01'), chronologicalMovements([
        ['2026-08-01', -150_000],
        ['2026-08-02', 20_000],
    ]));

    expect($balances)->toBe([-50_000, -30_000]);
});

test('keeps every balance null without an anchor', function (): void {
    $balances = (new ComputeRunningBalances)->handle(null, null, chronologicalMovements([
        ['2026-08-01', 50_000],
        ['2026-08-02', -20_000],
    ]));

    expect($balances)->toBe([null, null]);
});

test('carries balances through negative territory', function (): void {
    $balances = (new ComputeRunningBalances)->handle(-10_000, CarbonImmutable::parse('2026-08-05'), chronologicalMovements([
        ['2026-08-03', -30_000],
        ['2026-08-05', 5_000],
        ['2026-08-07', 4_000],
    ]));

    expect($balances)->toBe([-15_000, -10_000, -6_000]);
});

test('returns an empty list for no movements', function (): void {
    expect((new ComputeRunningBalances)->handle(100, CarbonImmutable::parse('2026-08-01'), []))->toBe([]);
});
