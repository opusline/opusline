<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Invoices\Data\InvoiceCountsData;
use App\Domain\Invoices\Data\InvoiceForecastData;
use App\Domain\Invoices\Data\InvoiceOverdueData;
use App\Domain\Invoices\Data\InvoiceSummaryData;
use App\Domain\Invoices\Data\InvoiceTodoData;
use App\Domain\Invoices\Data\InvoiceTotalData;
use App\Domain\Invoices\Data\SummarizeInvoicesData;
use App\Domain\Invoices\Enums\InvoiceForecastBucket;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\InvoiceTodoKind;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;

/**
 * @phpstan-type UnbilledWork array{mission: Mission, entries: non-empty-list<TimeEntry>, amount: Money, days: ?float, minutes: ?int}
 */
class SummarizeInvoices
{
    /** Long enough to be worth acting on, short enough to stay a list. */
    private const int TODO_LIMIT = 20;

    private const int BASIS_POINTS = 10_000;

    public function __construct(private readonly ValueTrackedTime $valueTrackedTime) {}

    public function handle(User $user, SummarizeInvoicesData $data): InvoiceSummaryData
    {
        $month = CarbonImmutable::parse(($data->month ?? CarbonImmutable::today()->format('Y-m')).'-01');
        $today = CarbonImmutable::today();

        $outstanding = $this->outstanding($user);
        $overdue = $outstanding->filter(fn (Invoice $invoice): bool => $invoice->due_on->isBefore($today))->values();
        $unbilled = $this->unbilledByMission($user);

        return new InvoiceSummaryData(
            month: $month->format('Y-m'),
            toCollect: $this->totalOf($outstanding),
            overdue: $this->overdue($overdue, $today),
            proAccountBalance: null,
            forecast: $this->forecast($outstanding, $today),
            monthUnbilled: $this->unbilledIn($unbilled, $month),
            counts: $this->counts($user, $today),
            todo: $this->todo($overdue, $unbilled, $today),
            todoTotal: $overdue->count() + count($unbilled),
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
    private function overdue(Collection $overdue, CarbonImmutable $today): InvoiceOverdueData
    {
        $total = $this->totalOf($overdue);
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
    private function unbilledByMission(User $user): array
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
            fn (array $group): array => $this->work($group['mission'], $group['entries']),
            array_values($grouped),
        );

        usort($rows, static fn (array $a, array $b): int => (int) $b['amount']->getAmount() <=> (int) $a['amount']->getAmount());

        return $rows;
    }

    /**
     * @param  non-empty-list<TimeEntry>  $entries
     * @return UnbilledWork
     */
    private function work(Mission $mission, array $entries): array
    {
        $isHourly = $mission->billing_mode === BillingMode::Hourly;

        return [
            'mission' => $mission,
            'entries' => $entries,
            'amount' => $this->valueTrackedTime->handle($mission, $entries),
            'days' => $isHourly ? null : $this->valueTrackedTime->billedDays($mission, $entries),
            'minutes' => $isHourly ? $this->valueTrackedTime->billedMinutes($mission, $entries) : null,
        ];
    }

    /**
     * The month card: what was worked in the month on show and still is not on any
     * invoice. Counted in periods, not entries — one mission's month is one invoice
     * waiting to be written, however many days went into it.
     *
     * @param  list<UnbilledWork>  $unbilled
     */
    private function unbilledIn(array $unbilled, CarbonImmutable $month): InvoiceTotalData
    {
        $total = new Money(0, config()->string('app.currency'));
        $periods = 0;

        foreach ($unbilled as $row) {
            $entries = array_values(array_filter(
                $row['entries'],
                static fn (TimeEntry $entry): bool => $entry->date->isSameMonth($month),
            ));

            if ($entries === []) {
                continue;
            }

            $total = $total->add($this->valueTrackedTime->handle($row['mission'], $entries));
            $periods++;
        }

        return new InvoiceTotalData(amount: MoneyData::fromMoney($total), count: $periods);
    }

    /**
     * @param  Collection<int, Invoice>  $outstanding
     * @return list<InvoiceForecastData>
     */
    private function forecast(Collection $outstanding, CarbonImmutable $today): array
    {
        $currency = config()->string('app.currency');

        /** @var array<int, Money> $totals */
        $totals = [];

        foreach (InvoiceForecastBucket::cases() as $bucket) {
            $totals[$bucket->value] = new Money(0, $currency);
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
     * Anything due beyond 60 days is real money but not yet news, so it sits outside
     * the three bars rather than inflating the last one.
     */
    private function bucketFor(CarbonImmutable $dueOn, CarbonImmutable $today): ?InvoiceForecastBucket
    {
        if ($dueOn->isBefore($today)) {
            return InvoiceForecastBucket::Late;
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
     * Overdue first, then time that should have been invoiced — the order in which
     * each costs money to ignore.
     *
     * @param  Collection<int, Invoice>  $overdue
     * @param  list<UnbilledWork>  $unbilled
     * @return list<InvoiceTodoData>
     */
    private function todo(Collection $overdue, array $unbilled, CarbonImmutable $today): array
    {
        $items = [];

        foreach ($overdue as $invoice) {
            $items[] = new InvoiceTodoData(
                kind: InvoiceTodoKind::Overdue,
                amount: MoneyData::fromMoney($invoice->amount_ttc_cents),
                clientId: $invoice->client_id,
                clientName: $invoice->client->name,
                invoiceId: $invoice->id,
                number: $invoice->number,
                dueOn: $invoice->due_on,
                daysLate: $this->daysLate($invoice, $today),
                missionId: $invoice->mission_id,
                missionName: null,
                entryCount: null,
                firstEntryOn: null,
                lastEntryOn: null,
                valuedDays: null,
                valuedMinutes: null,
                timeEntryIds: [],
            );
        }

        foreach ($unbilled as $row) {
            $entries = $row['entries'];

            $items[] = new InvoiceTodoData(
                kind: InvoiceTodoKind::UnbilledWork,
                amount: MoneyData::fromMoney($row['amount']),
                clientId: $row['mission']->client_id,
                clientName: $row['mission']->client->name,
                invoiceId: null,
                number: null,
                dueOn: null,
                daysLate: null,
                missionId: $row['mission']->id,
                missionName: $row['mission']->name,
                entryCount: count($entries),
                firstEntryOn: $entries[0]->date,
                lastEntryOn: $entries[count($entries) - 1]->date,
                valuedDays: $row['days'],
                valuedMinutes: $row['minutes'],
                timeEntryIds: array_map(static fn (TimeEntry $entry): int => $entry->id, $entries),
            );
        }

        return array_slice($items, 0, self::TODO_LIMIT);
    }

    /**
     * @param  Collection<int, Invoice>  $invoices
     */
    private function totalOf(Collection $invoices): InvoiceTotalData
    {
        $total = new Money(0, config()->string('app.currency'));

        foreach ($invoices as $invoice) {
            $total = $total->add($invoice->amount_ttc_cents);
        }

        return new InvoiceTotalData(
            amount: MoneyData::fromMoney($total),
            count: $invoices->count(),
        );
    }
}
