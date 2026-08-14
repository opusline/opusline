<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Data\CraCountsData;
use App\Domain\Cra\Data\CraListData;
use App\Domain\Cra\Data\CraListItemData;
use App\Domain\Cra\Data\ListCrasData;
use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Cra\Models\Cra;
use App\Domain\Cra\Models\CraDay;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Collection;

/**
 * Every CRA the user owes or has produced.
 *
 * A month with no row yet is listed all the same, with a null id — that is what "à
 * produire" means. The row is created when the user opens it, so listing never writes.
 */
class ListCras
{
    public function __construct(private readonly MaterializeCraDays $materializeCraDays) {}

    public function handle(User $user, ListCrasData $data): CraListData
    {
        $currentMonth = $user->settingsOrFail()->today()->format('Y-m');
        $missions = $this->eligibleMissions($user);
        $tracked = $this->materializeCraDays->monthlyTotals($user, $missions);

        /** @var array<int, array<string, Cra>> $existing */
        $existing = [];

        // Summed as a subselect rather than by hydrating every CraDay: the list only
        // ever shows the month's total, and a long-lived account has thousands of them.
        $rows = $user->cras()
            ->whereIn('mission_id', $missions->modelKeys())
            ->withSum('days as reported_bp', 'day_fraction_bp')
            ->get();

        foreach ($rows as $row) {
            $existing[$row->mission_id][$row->month->format('Y-m')] = $row;
        }

        $items = [];

        foreach ($missions as $mission) {
            $missionTracked = $tracked[$mission->id] ?? [];
            $missionCras = $existing[$mission->id] ?? [];

            foreach ($this->monthsFor($mission, $missionTracked, $missionCras, $currentMonth) as $month) {
                $cra = $missionCras[$month] ?? null;

                $items[] = new CraListItemData(
                    id: $cra instanceof Cra ? $cra->id : null,
                    missionId: $mission->id,
                    missionSlug: $mission->slug,
                    missionName: $mission->name,
                    clientSlug: $mission->client->slug,
                    clientName: $mission->client->name,
                    color: $mission->effectiveColor(),
                    month: $month,
                    // A month nobody has opened yet reads as a draft: it is owed all the same.
                    status: $cra instanceof Cra ? $cra->status : CraStatus::Draft,
                    totalDays: CraDay::daysFromBasisPoints($cra instanceof Cra ? (int) $cra->reported_bp : 0),
                    trackedDays: CraDay::daysFromBasisPoints($missionTracked[$month] ?? 0),
                );
            }
        }

        $items = $this->sortedNewestFirst($items);

        // Counted before the filter: the counters say how much is outstanding overall,
        // and must not collapse to zero just because one month is being looked at.
        $counts = $this->counts($items);

        if ($data->month !== null) {
            $items = array_values(array_filter(
                $items,
                fn (CraListItemData $item): bool => $item->month === $data->month,
            ));
        }

        return new CraListData(cras: $items, counts: $counts);
    }

    /**
     * A CRA only makes sense where the client asked for one and the mission is measured
     * in days. Archived clients drop out: nobody is chasing a signature there.
     *
     * @return Collection<int, Mission>
     */
    private function eligibleMissions(User $user): Collection
    {
        return $user->missions()
            ->where('cra_required', true)
            // Belt and braces: the write path already forces cra_required off an hourly
            // mission, but a row that got there another way must not report hours as days.
            ->whereNot('billing_mode', BillingMode::Hourly)
            ->whereHas('client', fn ($query) => $query->whereNull('archived_at'))
            ->with('client')
            ->orderBy('name')
            ->get();
    }

    /**
     * The months this mission owes a CRA for.
     *
     * @param  array<string, int>  $tracked
     * @param  array<string, Cra>  $cras
     * @return list<string>
     */
    private function monthsFor(Mission $mission, array $tracked, array $cras, string $currentMonth): array
    {
        // Months with tracked time, whatever the mission's status: a finished mission
        // still owes the CRAs of the months it ran. Time logged ahead of today is not
        // reportable yet, and CreateCra refuses it — listing it would offer a row that
        // cannot be opened.
        $months = array_filter(
            array_keys($tracked),
            fn (string $month): bool => $month <= $currentMonth,
        );

        if ($mission->status === MissionStatus::Active) {
            $months[] = $currentMonth;
        }

        // Months that already have a row, so deleting the last entry of a month cannot
        // make a CRA the client already holds disappear from the list.
        $months = array_merge($months, array_keys($cras));

        $months = array_values(array_unique($months));
        sort($months);

        return $months;
    }

    /**
     * @param  list<CraListItemData>  $items
     * @return list<CraListItemData>
     */
    private function sortedNewestFirst(array $items): array
    {
        usort(
            $items,
            fn (CraListItemData $a, CraListItemData $b): int => [$b->month, $a->missionName] <=> [$a->month, $b->missionName],
        );

        return $items;
    }

    /**
     * @param  list<CraListItemData>  $items
     */
    private function counts(array $items): CraCountsData
    {
        $byStatus = array_count_values(array_map(
            fn (CraListItemData $item): int => $item->status->value,
            $items,
        ));

        return new CraCountsData(
            toProduce: $byStatus[CraStatus::Draft->value] ?? 0,
            sent: $byStatus[CraStatus::Sent->value] ?? 0,
            signed: $byStatus[CraStatus::Signed->value] ?? 0,
        );
    }
}
