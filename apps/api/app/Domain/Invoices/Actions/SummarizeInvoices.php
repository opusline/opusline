<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Invoices\Data\InvoiceCountsData;
use App\Domain\Invoices\Data\InvoiceForecastData;
use App\Domain\Invoices\Data\InvoiceSummaryData;
use App\Domain\Invoices\Data\InvoiceTodoData;
use App\Domain\Invoices\Data\InvoiceTotalData;
use App\Domain\Invoices\Data\SummarizeInvoicesData;
use App\Domain\Invoices\Enums\InvoiceForecastBucket;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\InvoiceTodoKind;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;

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

        $unbilled = $this->unbilledByMission($user);
        $outstanding = $this->outstanding($user);
        $overdue = $outstanding->filter(fn (Invoice $invoice): bool => $invoice->due_on->isBefore($today));
        $drafts = $user->invoices()->where('status', InvoiceStatus::Draft)->orderBy('issued_on')->get();

        return new InvoiceSummaryData(
            month: $month->format('Y-m'),
            invoiced: $this->invoicedIn($user, $month),
            toInvoice: $this->totalUnbilled($unbilled),
            collected: $this->collectedIn($user, $month),
            forecast: $this->forecast($outstanding, $today),
            counts: $this->counts($user, $today),
            todo: $this->todo($overdue, $unbilled, $drafts),
            todoTotal: $overdue->count() + count($unbilled) + $drafts->count(),
        );
    }

    private function invoicedIn(User $user, CarbonImmutable $month): InvoiceTotalData
    {
        $invoices = $user->invoices()
            ->where('status', '!=', InvoiceStatus::Draft)
            ->whereBetween('issued_on', [$month->toDateString(), $month->endOfMonth()->toDateString()])
            ->get();

        return $this->totalOf($invoices, fn (Invoice $invoice): Money => $invoice->amount_ht_cents);
    }

    /**
     * Bucketed on the payment date, never the issue date: URSSAF and TVA for a
     * micro-BNC are cash-basis, so this is the figure that gets declared.
     */
    private function collectedIn(User $user, CarbonImmutable $month): InvoiceTotalData
    {
        $invoices = $user->invoices()
            ->where('status', InvoiceStatus::Paid)
            ->whereBetween('paid_on', [$month->toDateString(), $month->endOfMonth()->toDateString()])
            ->get();

        return $this->totalOf($invoices, fn (Invoice $invoice): Money => $invoice->amount_ttc_cents);
    }

    /**
     * Issued, unpaid invoices — what is still owed, whatever its due date.
     *
     * @return Collection<int, Invoice>
     */
    private function outstanding(User $user): Collection
    {
        return $user->invoices()
            ->where('status', InvoiceStatus::Sent)
            ->orderBy('due_on')
            ->get();
    }

    /**
     * Billable tracked time that no invoice covers, grouped by the mission it sits on,
     * richest first.
     *
     * Missions billed as a fixed price or carrying no rate are skipped — their time
     * measures effort and margin, not an amount to bill — as are internal clients,
     * which are not billable at all.
     *
     * @return list<array{mission: Mission, amount: Money, count: int}>
     */
    private function unbilledByMission(User $user): array
    {
        $entries = $user->timeEntries()
            ->with('mission.client')
            ->whereNull('invoice_id')
            ->where('billable', true)
            ->get();

        /** @var array<int, array{mission: Mission, entries: list<TimeEntry>}> $grouped */
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

        $rows = [];

        foreach ($grouped as $group) {
            $rows[] = [
                'mission' => $group['mission'],
                'amount' => $this->valueTrackedTime->handle($group['mission'], $group['entries']),
                'count' => count($group['entries']),
            ];
        }

        usort($rows, static fn (array $a, array $b): int => (int) $b['amount']->getAmount() <=> (int) $a['amount']->getAmount());

        return $rows;
    }

    /**
     * @param  list<array{mission: Mission, amount: Money, count: int}>  $unbilled
     */
    private function totalUnbilled(array $unbilled): InvoiceTotalData
    {
        $total = new Money(0, config()->string('app.currency'));
        $count = 0;

        foreach ($unbilled as $row) {
            $total = $total->add($row['amount']);
            $count += $row['count'];
        }

        return new InvoiceTotalData(amount: MoneyData::fromMoney($total), count: $count);
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
     * Overdue first, then time that should have been invoiced, then drafts waiting to
     * go out — roughly the order in which each costs money to ignore.
     *
     * @param  Collection<int, Invoice>  $overdue
     * @param  list<array{mission: Mission, amount: Money, count: int}>  $unbilled
     * @param  Collection<int, Invoice>  $drafts
     * @return list<InvoiceTodoData>
     */
    private function todo(Collection $overdue, array $unbilled, Collection $drafts): array
    {
        $items = [];

        foreach ($overdue as $invoice) {
            $items[] = $this->fromInvoice($invoice, InvoiceTodoKind::Overdue);
        }

        foreach ($unbilled as $row) {
            $items[] = new InvoiceTodoData(
                kind: InvoiceTodoKind::UnbilledWork,
                invoiceId: null,
                missionId: $row['mission']->id,
                amount: MoneyData::fromMoney($row['amount']),
                dueOn: null,
                count: $row['count'],
            );
        }

        foreach ($drafts as $invoice) {
            $items[] = $this->fromInvoice($invoice, InvoiceTodoKind::DraftToSend);
        }

        return array_slice($items, 0, self::TODO_LIMIT);
    }

    private function fromInvoice(Invoice $invoice, InvoiceTodoKind $kind): InvoiceTodoData
    {
        return new InvoiceTodoData(
            kind: $kind,
            invoiceId: $invoice->id,
            missionId: $invoice->mission_id,
            amount: MoneyData::fromMoney($invoice->amount_ttc_cents),
            dueOn: $invoice->due_on,
            count: 1,
        );
    }

    /**
     * @param  Collection<int, Invoice>  $invoices
     * @param  callable(Invoice): Money  $amount
     */
    private function totalOf(Collection $invoices, callable $amount): InvoiceTotalData
    {
        $total = new Money(0, config()->string('app.currency'));

        foreach ($invoices as $invoice) {
            $total = $total->add($amount($invoice));
        }

        return new InvoiceTotalData(
            amount: MoneyData::fromMoney($total),
            count: $invoices->count(),
        );
    }
}
