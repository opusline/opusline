<?php

declare(strict_types=1);

namespace App\Domain\Cra\Calendar;

use Carbon\CarbonImmutable;

/**
 * The eleven French public holidays, so a CRA grid can grey out days nobody worked.
 *
 * Alsace-Moselle's two extra days (Good Friday and 26 December) are deliberately left
 * out: nothing we store says where the user works, and non-working days on a CRA are
 * contractual anyway — the grid stays clickable either way.
 */
class FrenchHolidays implements HolidayProvider
{
    /** @var array<int, array<string, string>> */
    private static array $byYear = [];

    /**
     * Holidays of a year, keyed by `Y-m-d`.
     *
     * @return array<string, string>
     */
    public function forYear(int $year): array
    {
        return self::$byYear[$year] ??= $this->compute($year);
    }

    /**
     * Holidays falling inside a range, keyed by `Y-m-d`.
     *
     * @return array<string, string>
     */
    public function between(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $holidays = [];

        foreach (range($from->year, $to->year) as $year) {
            $holidays += $this->forYear($year);
        }

        return array_filter(
            $holidays,
            fn (string $date): bool => $date >= $from->toDateString() && $date <= $to->toDateString(),
            ARRAY_FILTER_USE_KEY,
        );
    }

    /**
     * @return array<string, string>
     */
    private function compute(int $year): array
    {
        $easter = $this->easter($year);

        $holidays = [
            sprintf('%d-01-01', $year) => 'Jour de l\'an',
            $easter->addDay()->toDateString() => 'Lundi de Pâques',
            sprintf('%d-05-01', $year) => 'Fête du Travail',
            sprintf('%d-05-08', $year) => 'Victoire 1945',
            $easter->addDays(39)->toDateString() => 'Ascension',
            $easter->addDays(50)->toDateString() => 'Lundi de Pentecôte',
            sprintf('%d-07-14', $year) => 'Fête nationale',
            sprintf('%d-08-15', $year) => 'Assomption',
            sprintf('%d-11-01', $year) => 'Toussaint',
            sprintf('%d-11-11', $year) => 'Armistice 1918',
            sprintf('%d-12-25', $year) => 'Noël',
        ];

        ksort($holidays);

        return $holidays;
    }

    /**
     * Easter Sunday by the anonymous Gregorian algorithm.
     *
     * Not `easter_date()`: that lives in ext-calendar, which neither the Sail image nor
     * the FrankenPHP binary this app runs under bundles, so it would fail at request
     * time rather than at boot.
     */
    private function easter(int $year): CarbonImmutable
    {
        $a = $year % 19;
        $b = intdiv($year, 100);
        $c = $year % 100;
        $d = intdiv($b, 4);
        $e = $b % 4;
        $f = intdiv($b + 8, 25);
        $g = intdiv($b - $f + 1, 3);
        $h = (19 * $a + $b - $d - $g + 15) % 30;
        $i = intdiv($c, 4);
        $k = $c % 4;
        $l = (32 + 2 * $e + 2 * $i - $h - $k) % 7;
        $m = intdiv($a + 11 * $h + 22 * $l, 451);

        $month = intdiv($h + $l - 7 * $m + 114, 31);
        $day = (($h + $l - 7 * $m + 114) % 31) + 1;

        return CarbonImmutable::parse(sprintf('%04d-%02d-%02d', $year, $month, $day));
    }
}
