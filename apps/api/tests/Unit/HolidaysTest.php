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
