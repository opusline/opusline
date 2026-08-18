<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Invoices\Data\InvoiceCountsData;
use App\Domain\Invoices\Data\InvoiceForecastData;
use App\Domain\Invoices\Data\InvoiceOverdueData;
use App\Domain\Invoices\Data\InvoiceSummaryData;
use App\Domain\Invoices\Data\InvoiceTodoData;
use App\Domain\Invoices\Data\InvoiceTodoOverdueData;
use App\Domain\Invoices\Data\InvoiceTodoStepData;
use App\Domain\Invoices\Data\InvoiceTodoWorkData;
use App\Domain\Invoices\Data\InvoiceTotalData;
use App\Domain\Invoices\Data\SummarizeInvoicesData;
use App\Domain\Invoices\Enums\InvoiceForecastBucket;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\InvoiceTodoKind;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Missions\Models\MissionBillingStep;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Enums\Currency;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * @phpstan-type UnbilledWork array{mission: Mission, entries: non-empty-list<TimeEntry>, amount: Money, inMonth: Money, days: ?float, minutes: ?int}
 */
class SummarizeInvoices
{
    /** Long enough to be worth acting on, short enough to stay a list. */
    private const int TODO_LIMIT = 20;

    private const int BASIS_POINTS = 10_000;

    public function __construct(private readonly ValueTrackedTime $valueTrackedTime) {}

    public function handle(User $user, SummarizeInvoicesData $data): InvoiceSummaryData
    {
        $settings = $user->settingsOrFail();
        $today = $settings->today();
        $month = CarbonImmutable::parse(($data->month ?? $today->format('Y-m')).'-01');
        $currency = $settings->currency;

        $outstanding = $this->outstanding($user);
        $overdue = $outstanding->filter(fn (Invoice $invoice): bool => $invoice->due_on->isBefore($today))->values();
        $unbilled = $this->unbilledByMission($user, $month, $settings->workday_minutes);
        $dueSteps = $this->dueBillingSteps($user, $today);

        return new InvoiceSummaryData(
            month: $month->format('Y-m'),
            toCollect: $this->totalOf($outstanding, $currency),
            overdue: $this->overdue($overdue, $today, $currency),
            forecast: $this->forecast($outstanding, $today, $currency),
            monthUnbilled: $this->unbilledIn($unbilled, $currency),
            unbilled: $this->unbilledTotal($unbilled, $currency),
            counts: $this->counts($user, $today),
            todo: $this->todo($overdue, $unbilled, $dueSteps, $today, $settings),
            todoTotal: $overdue->count() + count($unbilled) + $dueSteps->count(),
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
            maxDaysLate: $worst instanceof Invoice ? $this->daysLate($worst->due_on, $today) : 0,
        );
    }

    /**
     * How far a due date has passed. Zero when there is none, or when it is still
     * ahead — an instalment expected next month is not late by a negative number.
     */
    private function daysLate(?CarbonImmutable $dueOn, CarbonImmutable $today): int
    {
        if (! $dueOn instanceof CarbonImmutable || $dueOn->greaterThanOrEqualTo($today)) {
            return 0;
        }

        return (int) $dueOn->diffInDays($today);
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
     * Instalments of a fixed price the contract says are now due: either someone
     * marked the work behind them done, or the date they were expected on has come.
     *
     * These are a plan, not money. They are deliberately kept out of `unbilled` and
     * `monthUnbilled`, which mean "value already worked" — adding a step's amount
     * there would count the same forfait twice, once as effort and once as a term.
     *
     * @return Collection<int, MissionBillingStep>
     */
    private function dueBillingSteps(User $user, CarbonImmutable $today): Collection
    {
        return $user->billingSteps()
            // Currency must precede rate_cents so MoneyIntegerCast can build the
            // price; the rest is what the rows below actually read.
            ->with([
                'mission:id,client_id,name,status,currency,rate_cents',
                'mission.client:id,name,default_vat_rate_bp',
            ])
            ->whereNull('invoice_id')
            ->where(function (Builder $query) use ($today): void {
                $query->whereNotNull('ready_at')
                    ->orWhere('due_on', '<=', $today->toDateString());
            })
            // In SQL rather than a filter afterwards: a finished mission's steps
            // would otherwise be fetched and hydrated only to be thrown away.
            ->whereHas('mission', fn (Builder $query): Builder => $query->where('status', '!=', MissionStatus::Done))
            ->orderByRaw('due_on is null')
            ->orderBy('due_on')
            ->orderBy('position')
            ->get();
    }

    /**
     * Overdue first, then time that should have been invoiced — the order in which
     * each costs money to ignore.
     *
     * @param  Collection<int, Invoice>  $overdue
     * @param  list<UnbilledWork>  $unbilled
     * @param  Collection<int, MissionBillingStep>  $dueSteps
     * @return list<InvoiceTodoData>
     */
    private function todo(
        Collection $overdue,
        array $unbilled,
        Collection $dueSteps,
        CarbonImmutable $today,
        UserSettings $settings,
    ): array {
        // Each kind is guaranteed its third of the list and may spill into whatever
        // the others leave free. Filling the list overdue-first would let a long
        // backlog hide every invoice waiting to be written — and those rows' buttons
        // are the only way to write one.
        [$overdueTake, $unbilledTake, $stepTake] = $this->shares(
            $overdue->count(),
            count($unbilled),
            $dueSteps->count(),
        );

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
                    daysLate: $this->daysLate($invoice->due_on, $today),
                ),
            );
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

        $shownSteps = $dueSteps->take($stepTake);
        $invoicedByMission = $this->invoicedByMission($shownSteps);

        foreach ($shownSteps as $step) {
            $mission = $step->mission;
            $items[] = new InvoiceTodoData(
                kind: InvoiceTodoKind::BillingStep,
                amount: MoneyData::fromMoney($step->amount_cents),
                clientId: $mission->client_id,
                clientName: $mission->client->name,
                step: new InvoiceTodoStepData(
                    billingStepId: $step->id,
                    label: $step->label,
                    missionId: $mission->id,
                    missionName: $mission->name,
                    dueOn: $step->due_on,
                    isReady: $step->ready_at !== null,
                    daysLate: $this->daysLate($step->due_on, $today),
                    vatRateBp: $settings->effectiveVatRateBp($mission->client->default_vat_rate_bp),
                    // Signed, like the mission's own bar: past the agreed price
                    // this goes negative, and flooring it here would make the same
                    // "reste à facturer" fact read differently on two screens.
                    remainingCents: (int) ($mission->rate_cents?->getAmount() ?? 0)
                        - ($invoicedByMission[$mission->id] ?? 0),
                ),
            );
        }

        return $items;
    }

    /**
     * How many rows each kind gets. Every kind is guaranteed its equal share and
     * hands back whatever it does not use, so a single busy kind can fill the list
     * only once the other two have taken all they have.
     *
     * @return array{int, int, int}
     */
    private function shares(int $overdue, int $unbilled, int $steps): array
    {
        $counts = [$overdue, $unbilled, $steps];
        $floor = intdiv(self::TODO_LIMIT, count($counts));

        $shares = array_map(static fn (int $count): int => min($count, $floor), $counts);
        $slack = self::TODO_LIMIT - array_sum($shares);

        foreach ($counts as $index => $count) {
            $extra = min($count - $shares[$index], $slack);
            $shares[$index] += $extra;
            $slack -= $extra;
        }

        return $shares;
    }

    /**
     * Issued HT per mission, for the missions the rows on show belong to.
     *
     * One aggregate rather than one per row: a schedule's whole point is several
     * instalments on the same mission, so the per-step query was re-running the
     * identical SUM two or three times over.
     *
     * @param  Collection<int, MissionBillingStep>  $steps
     * @return array<int, int>
     */
    private function invoicedByMission(Collection $steps): array
    {
        $missionIds = $steps->pluck('mission_id')->unique()->values()->all();

        if ($missionIds === []) {
            return [];
        }

        /** @var array<int, int|string> $totals */
        $totals = Invoice::query()
            ->whereIn('mission_id', $missionIds)
            ->whereIn('status', InvoiceStatus::issued())
            ->toBase()
            ->selectRaw('mission_id, SUM(amount_ht_cents) as invoiced')
            ->groupBy('mission_id')
            ->pluck('invoiced', 'mission_id')
            ->all();

        return array_map(static fn (int|string $invoiced): int => (int) $invoiced, $totals);
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
