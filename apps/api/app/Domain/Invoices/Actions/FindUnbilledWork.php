<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Builder;

/**
 * @phpstan-type UnbilledWork array{mission: Mission, entries: non-empty-list<TimeEntry>, amount: Money, inMonth: Money, days: ?float, minutes: ?int}
 */
class FindUnbilledWork
{
    public function __construct(private readonly ValueTrackedTime $valueTrackedTime) {}

    /**
     * Billable tracked time that no invoice covers, grouped by the mission it sits on,
     * richest first.
     *
     * Missions billed as a fixed price or carrying no rate are skipped — their time
     * measures effort and margin, not an amount to bill — as are internal clients,
     * which are not billable at all.
     *
     * @return list<UnbilledWork>
     */
    public function handle(User $user, CarbonImmutable $month, int $workdayMinutes): array
    {
        $entries = $user->timeEntries()
            ->with('mission.client')
            ->whereNull('invoice_id')
            ->where('billable', true)
            // The query is the single home of the billability predicate: it
            // mirrors ValueTrackedTime::pricesTime() plus the internal-client
            // rule. Widening it can only over-fetch rows that measure() then
            // values at zero; there is no PHP re-check to drift from.
            ->whereHas('mission', function (Builder $mission): void {
                $mission
                    ->whereNotNull('rate_cents')
                    ->where('billing_mode', '!=', BillingMode::Fixed)
                    ->whereHas('client', function (Builder $client): void {
                        $client->where('type', '!=', ClientType::Internal);
                    });
            })
            ->orderBy('date')
            ->get();

        /** @var array<int, array{mission: Mission, entries: non-empty-list<TimeEntry>}> $grouped */
        $grouped = [];

        foreach ($entries as $entry) {
            $mission = $entry->mission;
            $grouped[$mission->id]['mission'] = $mission;
            $grouped[$mission->id]['entries'][] = $entry;
        }

        $rows = array_map(
            fn (array $group): array => $this->work($group['mission'], $group['entries'], $month, $workdayMinutes),
            array_values($grouped),
        );

        usort($rows, static fn (array $a, array $b): int => (int) $b['amount']->getAmount() <=> (int) $a['amount']->getAmount());

        return $rows;
    }

    /**
     * One pass per mission: the total, the slice of it worked in the month on show,
     * and the billed quantity all fall out of the same per-entry measurement.
     *
     * @param  non-empty-list<TimeEntry>  $entries
     * @return UnbilledWork
     */
    private function work(Mission $mission, array $entries, CarbonImmutable $month, int $workdayMinutes): array
    {
        $isHourly = $mission->billing_mode === BillingMode::Hourly;
        $amount = new Money(0, $mission->currency);
        $inMonth = new Money(0, $mission->currency);
        $days = 0.0;
        $minutes = 0;

        foreach ($entries as $entry) {
            $measured = $this->valueTrackedTime->measure($mission, $entry, $workdayMinutes);

            $amount = $amount->add($measured['value']);
            $days += $measured['days'];
            $minutes += $measured['minutes'];

            if ($entry->date->isSameMonth($month)) {
                $inMonth = $inMonth->add($measured['value']);
            }
        }

        return [
            'mission' => $mission,
            'entries' => $entries,
            'amount' => $amount,
            'inMonth' => $inMonth,
            'days' => $isHourly ? null : $days,
            'minutes' => $isHourly ? $minutes : null,
        ];
    }
}
