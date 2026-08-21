<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\FixedPriceBudgetData;
use App\Domain\Invoices\Data\FixedPriceConsumptionData;
use App\Domain\Invoices\Enums\FixedPriceBudgetState;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;

/**
 * Where every fixed-price mission of an account stands: how much of its price is
 * already on an invoice, and how much of it the time tracked has consumed.
 *
 * Read over the mission's whole life, not the current month — a forfait is agreed
 * once and eaten once, so a monthly cut would answer a question nobody asked.
 *
 * Folded in PHP rather than aggregated in SQL for the same reason as
 * SummarizeClientRevenue: the rounding lives in EntryRounding, and a second
 * definition of what a day is worth would drift from it.
 */
class SummarizeFixedPriceBudgets
{
    private const int BASIS_POINTS = 10_000;

    /**
     * Currency must precede the money columns: MoneyIntegerCast reads it to build them.
     *
     * @var list<string>
     */
    private const array MISSION_COLUMNS = [
        'id',
        'client_id',
        'billing_mode',
        'rounding',
        'currency',
        'rate_cents',
        'reference_daily_rate_cents',
    ];

    public function __construct(private readonly ValueTrackedTime $valueTrackedTime) {}

    /**
     * @param  array<int, int>|null  $missionIds  Narrows the fold to these missions; null reads the account.
     * @return array<int, FixedPriceBudgetData> keyed by mission id
     */
    public function handle(User $user, ?array $missionIds = null): array
    {
        return $this->forMissions($user, $this->fixedPriceMissions($user, $missionIds));
    }

    /**
     * The same fold over missions the caller already has in hand. Anything that has
     * loaded them — the revenue listing, the mission detail, the todo list — passes
     * them rather than paying for the same rows twice.
     *
     * @param  iterable<Mission>  $missions  Non-fixed-price missions are ignored.
     * @return array<int, FixedPriceBudgetData> keyed by mission id
     */
    public function forMissions(User $user, iterable $missions): array
    {
        $forfaits = [];

        foreach ($missions as $mission) {
            if ($mission->billing_mode === BillingMode::Fixed && $mission->rate_cents instanceof Money) {
                $forfaits[$mission->id] = $mission;
            }
        }

        if ($forfaits === []) {
            return [];
        }

        $workdayMinutes = $user->settingsOrFail()->workday_minutes;
        $entriesByMission = $this->billableEntries($user, $forfaits);

        $invoicesByMission = $user->invoices()
            ->whereIn('mission_id', array_keys($forfaits))
            ->get(['mission_id', 'status', 'currency', 'amount_ht_cents'])
            ->groupBy('mission_id')
            ->toBase();

        $budgets = [];

        foreach ($forfaits as $id => $mission) {
            $budgets[$id] = $this->forMission(
                $mission,
                $entriesByMission->get($id) ?? new Collection,
                $invoicesByMission->get($id) ?? new Collection,
                $workdayMinutes,
            );
        }

        return $budgets;
    }

    /**
     * Only the forfaits that can report a consumption are scanned: without a reference
     * rate their entries are read and then thrown away, and this is a lifetime scan.
     *
     * @param  array<int, Mission>  $forfaits
     * @return Collection<int|string, EloquentCollection<int, TimeEntry>>
     */
    private function billableEntries(User $user, array $forfaits): Collection
    {
        $priced = [];

        foreach ($forfaits as $id => $mission) {
            if ($this->referenceRateOf($mission) instanceof Money) {
                $priced[] = $id;
            }
        }

        if ($priced === []) {
            return new Collection;
        }

        return $user->timeEntries()
            ->whereIn('mission_id', $priced)
            ->where('billable', true)
            ->get(['mission_id', 'duration_minutes', 'rounding'])
            ->groupBy('mission_id')
            ->toBase();
    }

    /** A forfait priced at nothing per day cannot report what it has consumed. */
    private function referenceRateOf(Mission $mission): ?Money
    {
        $rate = $mission->reference_daily_rate_cents;

        return $rate instanceof Money && ! $rate->isZero() ? $rate : null;
    }

    /**
     * @param  array<int, int>|null  $missionIds
     * @return EloquentCollection<int, Mission>
     */
    private function fixedPriceMissions(User $user, ?array $missionIds): EloquentCollection
    {
        return $user->missions()
            ->where('billing_mode', BillingMode::Fixed)
            ->whereNotNull('rate_cents')
            ->when($missionIds !== null, fn (Builder $query): Builder => $query->whereIn('id', $missionIds))
            ->get(self::MISSION_COLUMNS);
    }

    /**
     * @param  Collection<int, TimeEntry>  $entries
     * @param  Collection<int, Invoice>  $invoices
     */
    private function forMission(Mission $mission, Collection $entries, Collection $invoices, int $workdayMinutes): FixedPriceBudgetData
    {
        /** @var Money $forfait */
        $forfait = $mission->rate_cents;

        $invoiced = new Money(0, $mission->currency);
        $draft = new Money(0, $mission->currency);

        foreach ($invoices as $invoice) {
            if ($invoice->status->isIssued()) {
                $invoiced = $invoiced->add($invoice->amount_ht_cents);
            } else {
                $draft = $draft->add($invoice->amount_ht_cents);
            }
        }

        return new FixedPriceBudgetData(
            forfait: MoneyData::fromMoney($forfait),
            invoiced: MoneyData::fromMoney($invoiced),
            draft: MoneyData::fromMoney($draft),
            remaining: SignedMoneyData::fromMoney($forfait->subtract($invoiced)->subtract($draft)),
            invoicedShareBp: $this->shareBp($invoiced, $forfait),
            consumption: $this->consumption($mission, $entries, $forfait, $workdayMinutes),
        );
    }

    /**
     * @param  Collection<int, TimeEntry>  $entries
     */
    private function consumption(Mission $mission, Collection $entries, Money $forfait, int $workdayMinutes): ?FixedPriceConsumptionData
    {
        $referenceRate = $this->referenceRateOf($mission);

        if (! $referenceRate instanceof Money) {
            return null;
        }

        $consumed = new Money(0, $mission->currency);
        $trackedDays = 0.0;

        foreach ($entries as $entry) {
            $measured = $this->valueTrackedTime->consumeAtReferenceRate($mission, $entry, $workdayMinutes, $referenceRate);

            $consumed = $consumed->add($measured['value']);
            $trackedDays += $measured['days'];
        }

        $consumedShareBp = $this->shareBp($consumed, $forfait);
        $coveredDays = (int) $forfait->getAmount() / (int) $referenceRate->getAmount();
        $isOverrun = $consumed->greaterThan($forfait);

        return new FixedPriceConsumptionData(
            referenceDailyRate: MoneyData::fromMoney($referenceRate),
            trackedDays: $trackedDays,
            consumed: MoneyData::fromMoney($consumed),
            consumedShareBp: $consumedShareBp,
            coveredDays: $coveredDays,
            remainingDays: $coveredDays - $trackedDays,
            overrun: MoneyData::fromMoney(
                $isOverrun ? $consumed->subtract($forfait) : new Money(0, $mission->currency),
            ),
            state: FixedPriceBudgetState::forConsumption($isOverrun, $consumedShareBp),
        );
    }

    private function shareBp(Money $part, Money $whole): int
    {
        $divisor = (int) $whole->getAmount();

        return $divisor === 0 ? 0 : intdiv((int) $part->getAmount() * self::BASIS_POINTS, $divisor);
    }
}
