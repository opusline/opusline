<?php

declare(strict_types=1);

use App\Domain\Cra\Calendar\FrenchHolidays;
use Carbon\CarbonImmutable;

test('a year has the eleven public holidays', function (int $year): void {
    expect(FrenchHolidays::forYear($year))->toHaveCount(11);
})->with([2024, 2025, 2026, 2027, 2028]);

test('places the fixed holidays', function (): void {
    $holidays = FrenchHolidays::forYear(2026);

    expect($holidays)
        ->toHaveKey('2026-01-01', 'Jour de l\'an')
        ->toHaveKey('2026-05-01', 'Fête du Travail')
        ->toHaveKey('2026-05-08', 'Victoire 1945')
        ->toHaveKey('2026-07-14', 'Fête nationale')
        ->toHaveKey('2026-08-15', 'Assomption')
        ->toHaveKey('2026-11-01', 'Toussaint')
        ->toHaveKey('2026-11-11', 'Armistice 1918')
        ->toHaveKey('2026-12-25', 'Noël');
});

test('derives the moveable holidays from Easter', function (int $year, string $easterMonday, string $ascension, string $pentecostMonday): void {
    $holidays = FrenchHolidays::forYear($year);

    expect($holidays)
        ->toHaveKey($easterMonday, 'Lundi de Pâques')
        ->toHaveKey($ascension, 'Ascension')
        ->toHaveKey($pentecostMonday, 'Lundi de Pentecôte');
})->with([
    'a leap year with an early Easter' => [2024, '2024-04-01', '2024-05-09', '2024-05-20'],
    'a late Easter' => [2025, '2025-04-21', '2025-05-29', '2025-06-09'],
    'the current year' => [2026, '2026-04-06', '2026-05-14', '2026-05-25'],
    'Easter in March' => [2027, '2027-03-29', '2027-05-06', '2027-05-17'],
]);

test('keeps only the holidays inside a range', function (): void {
    $holidays = FrenchHolidays::between(
        CarbonImmutable::parse('2026-05-01'),
        CarbonImmutable::parse('2026-05-31'),
    );

    expect(array_keys($holidays))->toBe(['2026-05-01', '2026-05-08', '2026-05-14', '2026-05-25']);
});

test('spans a range crossing a year boundary', function (): void {
    $holidays = FrenchHolidays::between(
        CarbonImmutable::parse('2026-12-20'),
        CarbonImmutable::parse('2027-01-05'),
    );

    expect(array_keys($holidays))->toBe(['2026-12-25', '2027-01-01']);
});
