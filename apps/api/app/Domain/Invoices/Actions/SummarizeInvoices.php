<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Invoices\Data\FixedPriceBudgetData;
use App\Domain\Invoices\Data\FixedPriceConsumptionData;
use App\Domain\Invoices\Data\InvoiceCountsData;
use App\Domain\Invoices\Data\InvoiceForecastData;
use App\Domain\Invoices\Data\InvoiceOverdueData;
use App\Domain\Invoices\Data\InvoiceSummaryData;
use App\Domain\Invoices\Data\InvoiceTodoBudgetData;
use App\Domain\Invoices\Data\InvoiceTodoData;
use App\Domain\Invoices\Data\InvoiceTodoOverdueData;
use App\Domain\Invoices\Data\InvoiceTodoWorkData;
use App\Domain\Invoices\Data\InvoiceTotalData;
use App\Domain\Invoices\Data\SummarizeInvoicesData;
use App\Domain\Invoices\Enums\FixedPriceBudgetState;
use App\Domain\Invoices\Enums\InvoiceForecastBucket;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\InvoiceTodoKind;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Enums\Currency;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;

/**
 * @phpstan-type UnbilledWork array{mission: Mission, entries: non-empty-list<TimeEntry>, amount: Money, inMonth: Money, days: ?float, minutes: ?int}
 */
class SummarizeInvoices
{
    /** Long enough to be worth acting on, short enough to stay a list. */
    private const int TODO_LIMIT = 20;

    private const int BASIS_POINTS = 10_000;

    public function __construct(
        private readonly ValueTrackedTime $valueTrackedTime,
        private readonly SummarizeFixedPriceBudgets $summarizeFixedPriceBudgets,
    ) {}

    public function handle(User $user, SummarizeInvoicesData $data): InvoiceSummaryData
    {
        $settings = $user->settingsOrFail();
        $today = $settings->today();
        $month = CarbonImmutable::parse(($data->month ?? $today->format('Y-m')).'-01');
        $currency = $settings->currency;

        $outstanding = $this->outstanding($user);
        $overdue = $outstanding->filter(fn (Invoice $invoice): bool => $invoice->due_on->isBefore($today))->values();
        $unbilled = $this->unbilledByMission($user, $month, $settings->workday_minutes);
        $budgets = $this->budgetRows($user, $settings);

        return new InvoiceSummaryData(
            month: $month->format('Y-m'),
            toCollect: $this->totalOf($outstanding, $currency),
            overdue: $this->overdue($overdue, $today, $currency),
            forecast: $this->forecast($outstanding, $today, $currency),
            monthUnbilled: $this->unbilledIn($unbilled, $currency),
            unbilled: $this->unbilledTotal($unbilled, $currency),
            counts: $this->counts($user, $today),
            todo: $this->todo($overdue, $budgets, $unbilled, $today, $settings),
            todoTotal: $overdue->count() + count($budgets) + count($unbilled),
        );
    }

    /**
     * Issued, unpaid invoices — what is still owed, whatever its due date.
     *
     * @return Collection<int, Invoice>
     */
    private function outstanding(User $user): Collection
    {
        return $user->invoices()
            ->with('client')
            ->where('status', InvoiceStatus::Sent)
            ->orderBy('due_on')
            ->get();
    }

    /**
     * @param  Collection<int, Invoice>  $overdue
     */
    private function overdue(Collection $overdue, CarbonImmutable $today, Currency $currency): InvoiceOverdueData
    {
        $total = $this->totalOf($overdue, $currency);
        $worst = $overdue->first();

        return new InvoiceOverdueData(
            amount: $total->amount,
            count: $total->count,
            maxDaysLate: $worst instanceof Invoice ? $this->daysLate($worst, $today) : 0,
        );
    }

    private function daysLate(Invoice $invoice, CarbonImmutable $today): int
    {
        return (int) $invoice->due_on->diffInDays($today);
    }

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
    private function unbilledByMission(User $user, CarbonImmutable $month, int $workdayMinutes): array
    {
        $entries = $user->timeEntries()
            ->with('mission.client')
            ->whereNull('invoice_id')
            ->where('billable', true)
            ->orderBy('date')
            ->get();

        /** @var array<int, array{mission: Mission, entries: non-empty-list<TimeEntry>}> $grouped */
        $grouped = [];

        foreach ($entries as $entry) {
            $mission = $entry->mission;

            if (! $this->valueTrackedTime->pricesTime($mission)) {
                continue;
            }

            if ($mission->client->type === ClientType::Internal) {
                continue;
            }

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

    /**
     * The month card: what was worked in the month on show and still is not on any
     * invoice. Counted in periods, not entries — one mission's month is one invoice
     * waiting to be written, however many days went into it.
     *
     * @param  list<UnbilledWork>  $unbilled
     */
    private function unbilledIn(array $unbilled, Currency $currency): InvoiceTotalData
    {
        $total = new Money(0, $currency->value);
        $periods = 0;

        foreach ($unbilled as $row) {
            if ($row['inMonth']->isZero()) {
                continue;
            }

            $total = $total->add($row['inMonth']);
            $periods++;
        }

        return new InvoiceTotalData(amount: MoneyData::fromMoney($total), count: $periods);
    }

    /**
     * The whole backlog, not just the month on show — the todo list is capped, so
     * this is the only place its grand total exists.
     *
     * @param  list<UnbilledWork>  $unbilled
     */
    private function unbilledTotal(array $unbilled, Currency $currency): InvoiceTotalData
    {
        $total = new Money(0, $currency->value);

        foreach ($unbilled as $row) {
            $total = $total->add($row['amount']);
        }

        return new InvoiceTotalData(amount: MoneyData::fromMoney($total), count: count($unbilled));
    }

    /**
     * @param  Collection<int, Invoice>  $outstanding
     * @return list<InvoiceForecastData>
     */
    private function forecast(Collection $outstanding, CarbonImmutable $today, Currency $currency): array
    {
        /** @var array<int, Money> $totals */
        $totals = [];

        foreach (InvoiceForecastBucket::cases() as $bucket) {
            $totals[$bucket->value] = new Money(0, $currency->value);
        }

        foreach ($outstanding as $invoice) {
            $bucket = $this->bucketFor($invoice->due_on, $today);

            if ($bucket instanceof InvoiceForecastBucket) {
                $totals[$bucket->value] = $totals[$bucket->value]->add($invoice->amount_ttc_cents);
            }
        }

        $largest = 0;

        foreach ($totals as $total) {
            $largest = max($largest, (int) $total->getAmount());
        }

        $bars = [];

        foreach (InvoiceForecastBucket::cases() as $bucket) {
            $amount = (int) $totals[$bucket->value]->getAmount();

            $bars[] = new InvoiceForecastData(
                bucket: $bucket,
                amount: MoneyData::fromMoney($totals[$bucket->value]),
                shareBp: $largest === 0 ? 0 : intdiv($amount * self::BASIS_POINTS, $largest),
            );
        }

        return $bars;
    }

    /**
     * Already-due money is reported as `overdue`, not forecast. Anything due beyond 60
     * days is real money but not yet news, so it sits outside the bars rather than
     * inflating the last one.
     */
    private function bucketFor(CarbonImmutable $dueOn, CarbonImmutable $today): ?InvoiceForecastBucket
    {
        if ($dueOn->isBefore($today)) {
            return null;
        }

        if ($dueOn->lessThanOrEqualTo($today->addDays(30))) {
            return InvoiceForecastBucket::Next30;
        }

        return $dueOn->lessThanOrEqualTo($today->addDays(60)) ? InvoiceForecastBucket::Next60 : null;
    }

    private function counts(User $user, CarbonImmutable $today): InvoiceCountsData
    {
        return new InvoiceCountsData(
            all: $user->invoices()->count(),
            draft: $user->invoices()->where('status', InvoiceStatus::Draft)->count(),
            sent: $user->invoices()->where('status', InvoiceStatus::Sent)->count(),
            late: $user->invoices()
                ->where('status', InvoiceStatus::Sent)
                ->where('due_on', '<', $today->toDateString())
                ->count(),
            paid: $user->invoices()->where('status', InvoiceStatus::Paid)->count(),
        );
    }

    /**
     * A forfait whose time is running out, or has already run over. One row per
     * mission, and never both kinds for the same one — past the price, the overrun is
     * the news, not the balance left to bill.
     *
     * A comfortable forfait says nothing: this list is what costs money to ignore,
     * and a mission at 30 % is not that. Neither does a finished one — its overrun is
     * history, and no action on this list would clear the row.
     *
     * @return list<InvoiceTodoData>
     */
    private function budgetRows(User $user, UserSettings $settings): array
    {
        $missions = $user->missions()
            ->with('client')
            ->where('billing_mode', BillingMode::Fixed)
            ->where('status', '!=', MissionStatus::Done)
            ->get()
            ->reject(fn (Mission $mission): bool => $mission->client->type === ClientType::Internal);

        $budgets = $this->summarizeFixedPriceBudgets->forMissions($user, $missions);
        $candidates = [];

        foreach ($missions as $mission) {
            $budget = $budgets[$mission->id] ?? null;

            if (! $budget instanceof FixedPriceBudgetData) {
                continue;
            }

            $consumption = $budget->consumption;

            if (! $consumption instanceof FixedPriceConsumptionData) {
                continue;
            }

            $kind = $this->budgetKindFor($consumption, $budget);

            if ($kind instanceof InvoiceTodoKind) {
                $candidates[] = ['mission' => $mission, 'budget' => $budget, 'consumption' => $consumption, 'kind' => $kind];
            }
        }

        // Worst first: the list is capped, and a forfait at 180 % must not be dropped
        // for one at 81 % that happens to sort earlier by name.
        usort(
            $candidates,
            static fn (array $a, array $b): int => $b['consumption']->consumedShareBp <=> $a['consumption']->consumedShareBp,
        );

        return array_map(
            fn (array $candidate): InvoiceTodoData => $this->budgetRow($candidate, $settings),
            $candidates,
        );
    }

    /**
     * @param  array{mission: Mission, budget: FixedPriceBudgetData, consumption: FixedPriceConsumptionData, kind: InvoiceTodoKind}  $candidate
     */
    private function budgetRow(array $candidate, UserSettings $settings): InvoiceTodoData
    {
        $mission = $candidate['mission'];
        $budget = $candidate['budget'];

        return new InvoiceTodoData(
            kind: $candidate['kind'],
            amount: $candidate['kind'] === InvoiceTodoKind::FixedPriceOverrun
                ? $candidate['consumption']->overrun
                : MoneyData::fromMoney($budget->remaining->toMoney()),
            clientId: $mission->client_id,
            clientName: $mission->client->name,
            budget: new InvoiceTodoBudgetData(
                missionId: $mission->id,
                missionName: $mission->name,
                missionSlug: $mission->slug,
                clientSlug: $mission->client->slug,
                budget: $budget,
                vatRateBp: $settings->effectiveVatRateBp($mission->client->default_vat_rate_bp),
            ),
        );
    }

    /**
     * Null when the forfait has nothing to say: still comfortable, or already fully
     * invoiced and within budget — a row with no figure on it is noise.
     */
    private function budgetKindFor(FixedPriceConsumptionData $consumption, FixedPriceBudgetData $budget): ?InvoiceTodoKind
    {
        if ($consumption->state === FixedPriceBudgetState::Exceeded) {
            return InvoiceTodoKind::FixedPriceOverrun;
        }

        if ($consumption->state === FixedPriceBudgetState::Warning && $budget->remaining->amount > 0) {
            return InvoiceTodoKind::FixedPriceBudget;
        }

        return null;
    }

    /**
     * Overdue first, then forfaits about to cost you money, then time that should have
     * been invoiced — the order in which each costs money to ignore.
     *
     * @param  Collection<int, Invoice>  $overdue
     * @param  list<InvoiceTodoData>  $budgets
     * @param  list<UnbilledWork>  $unbilled
     * @return list<InvoiceTodoData>
     */
    private function todo(
        Collection $overdue,
        array $budgets,
        array $unbilled,
        CarbonImmutable $today,
        UserSettings $settings,
    ): array {
        [$overdueTake, $budgetTake, $unbilledTake] = $this->allocateSlots([
            $overdue->count(),
            count($budgets),
            count($unbilled),
        ]);

        $items = [];

        foreach ($overdue->take($overdueTake) as $invoice) {
            $items[] = new InvoiceTodoData(
                kind: InvoiceTodoKind::Overdue,
                amount: MoneyData::fromMoney($invoice->amount_ttc_cents),
                clientId: $invoice->client_id,
                clientName: $invoice->client->name,
                overdue: new InvoiceTodoOverdueData(
                    invoiceId: $invoice->id,
                    number: $invoice->number,
                    dueOn: $invoice->due_on,
                    daysLate: $this->daysLate($invoice, $today),
                ),
            );
        }

        foreach (array_slice($budgets, 0, $budgetTake) as $row) {
            $items[] = $row;
        }

        foreach (array_slice($unbilled, 0, $unbilledTake) as $row) {
            $entries = $row['entries'];

            $items[] = new InvoiceTodoData(
                kind: InvoiceTodoKind::UnbilledWork,
                amount: MoneyData::fromMoney($row['amount']),
                clientId: $row['mission']->client_id,
                clientName: $row['mission']->client->name,
                work: new InvoiceTodoWorkData(
                    missionId: $row['mission']->id,
                    missionName: $row['mission']->name,
                    entryCount: count($entries),
                    firstEntryOn: $entries[0]->date,
                    lastEntryOn: $entries[count($entries) - 1]->date,
                    valuedDays: $row['days'],
                    valuedMinutes: $row['minutes'],
                    timeEntryIds: array_map(static fn (TimeEntry $entry): int => $entry->id, $entries),
                    vatRateBp: $settings->effectiveVatRateBp($row['mission']->client->default_vat_rate_bp),
                ),
            );
        }

        return $items;
    }

    /**
     * How many rows each kind gets out of TODO_LIMIT: an equal floor each, then the
     * slots nobody claimed handed down in the order given.
     *
     * Filling the list in priority order alone would let a long overdue backlog hide
     * every invoice waiting to be written — and that row's button is the only way to
     * write one — or every forfait about to cost money.
     *
     * @param  list<int>  $available  How many rows each kind could contribute, most urgent first.
     * @return list<int>
     */
    private function allocateSlots(array $available): array
    {
        $floor = intdiv(self::TODO_LIMIT, count($available));
        $takes = array_map(static fn (int $count): int => min($count, $floor), $available);
        $spare = self::TODO_LIMIT - array_sum($takes);

        foreach ($available as $index => $count) {
            $extra = min($spare, $count - $takes[$index]);
            $takes[$index] += $extra;
            $spare -= $extra;
        }

        return array_values($takes);
    }

    /**
     * @param  Collection<int, Invoice>  $invoices
     */
    private function totalOf(Collection $invoices, Currency $currency): InvoiceTotalData
    {
        $total = new Money(0, $currency->value);

        foreach ($invoices as $invoice) {
            $total = $total->add($invoice->amount_ttc_cents);
        }

        return new InvoiceTotalData(
            amount: MoneyData::fromMoney($total),
            count: $invoices->count(),
        );
    }
}
