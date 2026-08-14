<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Models\CraDay;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;

/**
 * The day grid a month of tracked time produces, keyed by `Y-m-d` and valued in basis
 * points of a workday. Days with nothing worked are absent rather than zero.
 *
 * A CRA reports what the client is invoiced for — its total is literally labelled
 * "Total à facturer" — so time deliberately marked non-billable stays off the grid.
 */
class MaterializeCraDays
{
    /**
     * @return array<string, int>
     */
    public function handle(Mission $mission, CarbonImmutable $month): array
    {
        $workdayMinutes = $mission->user->settingsOrFail()->workday_minutes;
        /** @var SupportCollection<int, object{date: string, minutes: int|numeric-string}> $rows */
        $rows = $mission->timeEntries()
            ->where('billable', true)
            ->whereBetween('date', [
                $month->startOfMonth()->toDateString(),
                $month->endOfMonth()->toDateString(),
            ])
            ->toBase()
            ->selectRaw('date, SUM(duration_minutes) as minutes')
            ->groupBy('date')
            ->get();

        $minutesPerDay = [];

        foreach ($rows as $row) {
            $minutesPerDay[$row->date] = (int) $row->minutes;
        }

        $grid = $this->grid($minutesPerDay, $mission->effectiveRounding(), $workdayMinutes);

        // Sorted here rather than in grid(): DescribeCra compares this against a stored
        // grid with a strict !==, which is key-order sensitive. The monthly totals path
        // re-buckets by month and does its own sort, so it would pay for nothing.
        ksort($grid);

        return $grid;
    }

    /**
     * Every month each mission has tracked time in, with the days it totals, in one
     * query — the list screen shows a dozen missions at once and must not fan out.
     *
     * @param  Collection<int, Mission>  $missions
     * @return array<int, array<string, int>> mission id => `Y-m` => basis points
     */
    public function monthlyTotals(User $user, Collection $missions): array
    {
        if ($missions->isEmpty()) {
            return [];
        }

        $workdayMinutes = $user->settingsOrFail()->workday_minutes;

        // Aggregated in SQL rather than hydrated: this runs on every list, and an
        // account with years of tracking would otherwise pull every entry it ever
        // recorded into memory just to add them back up.
        /** @var SupportCollection<int, object{mission_id: int, date: string, minutes: int|numeric-string}> $rows */
        $rows = $user->timeEntries()
            ->where('billable', true)
            ->whereIn('mission_id', $missions->modelKeys())
            ->toBase()
            ->selectRaw('mission_id, date, SUM(duration_minutes) as minutes')
            ->groupBy('mission_id', 'date')
            ->get();

        /** @var array<int, array<string, int>> $byMission */
        $byMission = [];

        foreach ($rows as $row) {
            $byMission[$row->mission_id][$row->date] = (int) $row->minutes;
        }

        $totals = [];

        foreach ($missions as $mission) {
            $grid = $this->grid($byMission[$mission->id] ?? [], $mission->effectiveRounding(), $workdayMinutes);

            $byMonth = [];

            foreach ($grid as $date => $basisPoints) {
                $month = mb_substr($date, 0, 7);
                $byMonth[$month] = ($byMonth[$month] ?? 0) + $basisPoints;
            }

            ksort($byMonth);

            $totals[$mission->id] = $byMonth;
        }

        return $totals;
    }

    /**
     * The day is rounded once, from the day's total minutes — never per entry.
     *
     * Rounding each entry and summing the results inflates the day: at half-day
     * rounding three one-hour entries would each start a half-day and report a full
     * day for three hours of work. An invoice values entries one by one because it
     * bills lines; a CRA answers "how much of this day did I work", which is a
     * question about the day. Per-entry rounding overrides are an invoicing concern
     * and deliberately do not apply here — one day needs one rounding, and the
     * mission's is the one the client agreed to.
     *
     * @param  array<string, int>  $minutesPerDay
     * @return array<string, int>
     */
    private function grid(array $minutesPerDay, EntryRounding $missionRounding, int $workdayMinutes): array
    {
        $grid = [];

        foreach ($minutesPerDay as $date => $minutes) {
            // billedDayFraction() caps the day at one workday — a client is billed
            // days, not overtime — so the grid never exceeds FULL_DAY_BP.
            [$numerator, $denominator] = $missionRounding->billedDayFraction($minutes, $workdayMinutes);

            $grid[$date] = (int) round($numerator * CraDay::FULL_DAY_BP / $denominator);
        }

        return $grid;
    }
}
