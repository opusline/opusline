<?php

declare(strict_types=1);

use App\Domain\Cra\Calendar\FrenchHolidays;
use App\Domain\Cra\Calendar\Holidays;
use Carbon\CarbonImmutable;

test('serves the French calendar to a business established in France', function (): void {
    expect(Holidays::for('FR'))->toBeInstanceOf(FrenchHolidays::class);
});

test('serves an empty calendar to a country without holiday support', function (): void {
    $holidays = Holidays::for('CA')->between(
        CarbonImmutable::parse('2026-07-01'),
        CarbonImmutable::parse('2026-07-31'),
    );

    expect($holidays)->toBe([]);
});

test('leaves a working day where it is', function (): void {
    expect(Holidays::nextBusinessDay('FR', CarbonImmutable::parse('2026-08-20'))->toDateString())
        ->toBe('2026-08-20');
});

test('rolls a weekend forward to the Monday', function (string $date, string $expected): void {
    expect(Holidays::nextBusinessDay('FR', CarbonImmutable::parse($date))->toDateString())->toBe($expected);
})->with([
    'Saturday' => ['2026-08-22', '2026-08-24'],
    'Sunday' => ['2026-08-23', '2026-08-24'],
]);

test('rolls a jour férié forward, and past the weekend behind it', function (string $label, string $date, string $expected): void {
    expect(Holidays::nextBusinessDay('FR', CarbonImmutable::parse($date))->toDateString())->toBe($expected);
})->with([
    ['14 juillet 2026, a Tuesday', '2026-07-14', '2026-07-15'],
    ['1er mai 2026, a Friday', '2026-05-01', '2026-05-04'],
    ['Lundi de Pâques 2026', '2026-04-06', '2026-04-07'],
    ['Noël 2026, a Friday', '2026-12-25', '2026-12-28'],
]);

test('never rolls in a country whose calendar is not implemented', function (): void {
    // A Saturday: without a holiday provider only the weekend can move it.
    expect(Holidays::nextBusinessDay('CA', CarbonImmutable::parse('2026-08-22'))->toDateString())
        ->toBe('2026-08-24');
});
