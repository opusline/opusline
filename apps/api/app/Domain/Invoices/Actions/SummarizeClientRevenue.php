<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Data\ClientRevenueData;
use App\Domain\Invoices\Data\ClientRevenueDetailData;
use App\Domain\Invoices\Data\ClientRevenueListData;
use App\Domain\Invoices\Data\MissionRevenueData;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Revenue\RevenueWindow;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Money\Money as MoneyPhp;

/**
 * Per-client and per-mission revenue and tracked time, for the clients listing
 * and for the client and mission detail headers.
 *
 * The ledger is read once and folded in PHP rather than aggregated per client
 * in SQL: a freelancer's invoice count is small, it keeps the query count fixed
 * whatever the client count, and it avoids date arithmetic that differs between
 * the MySQL of production and the SQLite of the test suite.
 */
class SummarizeClientRevenue
{
    public function __construct(private readonly ValueTrackedTime $valueTrackedTime) {}

    /**
     * @var list<string>
     */
    private const array INVOICE_COLUMNS = [
        'client_id',
        'mission_id',
        'status',
        'issued_on',
        'paid_on',
        'amount_ht_cents',
        'amount_ttc_cents',
        'currency',
    ];

    /**
     * Enough of a mission to value its tracked time: the unit it bills in and
     * the increment it rounds to.
     *
     * @var list<string>
     */
    private const array MISSION_COLUMNS = [
        'id',
        'client_id',
        'billing_mode',
        'rounding',
        'status',
        'end_date',
        // Currency must precede rate_cents: MoneyIntegerCast reads it to build the rate.
        'currency',
        'rate_cents',
    ];

    public function handle(User $user): ClientRevenueListData
    {
        $window = $this->windowFor($user);

        $invoicesByClient = $this->billedInvoices($user)->get(self::INVOICE_COLUMNS)->groupBy('client_id');
        $entriesByMission = $this->entriesThisMonth($user, $window, null);

        $clients = $user->clients()
            ->with('missions:'.implode(',', self::MISSION_COLUMNS))
            ->orderBy('name')
            ->get(['id']);

        $rows = $clients->map(fn (Client $client): ClientRevenueData => $this->forClient(
            $client,
            $invoicesByClient->get($client->id) ?? new Collection,
            $entriesByMission,
            $window,
        ));

        return new ClientRevenueListData(
            year: $window->year,
            clients: array_values($rows->all()),
        );
    }

    /**
     * One client's figures, read without folding the rest of the account —
     * the detail page needs a point lookup, not the whole listing payload.
     */
    public function forOneClient(User $user, Client $client): ClientRevenueDetailData
    {
        $window = $this->windowFor($user);

        $invoices = $this->billedInvoices($user)
            ->where('client_id', $client->id)
            ->get(self::INVOICE_COLUMNS);

        // load, not loadMissing: a caller handing in a Client whose missions were
        // already read with a narrower select would otherwise reach the fold
        // without billing_mode or rate_cents.
        $client->load('missions:'.implode(',', self::MISSION_COLUMNS));
        $missionIds = $client->missions->modelKeys();

        return new ClientRevenueDetailData(
            year: $window->year,
            revenue: $this->forClient(
                $client,
                $invoices,
                $this->entriesThisMonth($user, $window, $missionIds),
                $window,
            ),
        );
    }

    public function forOneMission(User $user, Mission $mission): MissionRevenueData
    {
        $invoices = $this->billedInvoices($user)
            ->where('mission_id', $mission->id)
            ->get(self::INVOICE_COLUMNS);

        $window = $this->windowFor($user);

        return $this->forMission(
            $mission,
            $invoices,
            $this->entriesThisMonth($user, $window, [$mission->id])->get($mission->id) ?? new Collection,
            $window,
        );
    }

    private function windowFor(User $user): RevenueWindow
    {
        $settings = $user->settingsOrFail();

        return RevenueWindow::around($settings->today(), $settings->currency->value, $settings->workday_minutes);
    }

    /**
     * Issued invoices only: a draft has not reached the client, so it is neither
     * revenue nor a debt.
     *
     * @return HasMany<Invoice, User>
     */
    private function billedInvoices(User $user): HasMany
    {
        return $user->invoices()->whereIn('status', [InvoiceStatus::Sent, InvoiceStatus::Paid]);
    }

    /**
     * @param  Collection<int, Invoice>  $invoices
     * @param  Collection<int|string, EloquentCollection<int, TimeEntry>>  $entriesByMission
     */
    private function forClient(Client $client, Collection $invoices, Collection $entriesByMission, RevenueWindow $window): ClientRevenueData
    {
        $byMission = $invoices->groupBy('mission_id');

        $rows = $client->missions->map(fn (Mission $mission): MissionRevenueData => $this->forMission(
            $mission,
            $byMission->get($mission->id) ?? new Collection,
            $entriesByMission->get($mission->id) ?? new Collection,
            $window,
        ));

        return new ClientRevenueData(
            clientId: $client->id,
            yearToDate: MoneyData::fromMoney($this->issuedThisYear($invoices, $window)),
            pending: MoneyData::fromMoney($this->pending($invoices, $window)),
            averagePaymentDelayDays: $this->averagePaymentDelayDays($invoices),
            missions: array_values($rows->all()),
        );
    }

    /**
     * @param  Collection<int, Invoice>  $invoices
     * @param  Collection<int, TimeEntry>  $entries  tracked this month
     */
    private function forMission(Mission $mission, Collection $invoices, Collection $entries, RevenueWindow $window): MissionRevenueData
    {
        $total = $this->sumHt($invoices, $window);
        $tracked = $this->trackedThisMonth($mission, $entries, $window);

        return new MissionRevenueData(
            missionId: $mission->id,
            yearToDate: MoneyData::fromMoney($this->issuedThisYear($invoices, $window)),
            currentMonth: MoneyData::fromMoney($this->earnedThisMonth($mission, $invoices, $entries, $window)),
            total: MoneyData::fromMoney($total),
            monthlyAverage: $this->monthlyAverage($mission, $invoices, $total, $window),
            currentMonthDays: $tracked['days'],
            currentMonthMinutes: $tracked['minutes'],
        );
    }

    /**
     * This month's billable entries, grouped by mission, for the given missions
     * or the whole account when null.
     *
     * Read in one query and folded in PHP for the same reason the invoices are:
     * the rounding lives in EntryRounding, and reimplementing it in SQL would
     * give the listing a second, drifting definition of what a day is worth.
     *
     * @param  array<int, int>|null  $missionIds
     * @return Collection<int|string, EloquentCollection<int, TimeEntry>>
     */
    private function entriesThisMonth(User $user, RevenueWindow $window, ?array $missionIds): Collection
    {
        return $user->timeEntries()
            ->when($missionIds !== null, fn (Builder $query): Builder => $query->whereIn('mission_id', $missionIds))
            ->where('billable', true)
            // Bare Y-m-d, not the Carbon instances: bound with their time component
            // they compare as '2026-08-01 00:00:00' against a date column, which
            // sorts after '2026-08-01' and silently drops the first of the month.
            ->whereBetween('date', [$window->monthStart->toDateString(), $window->monthEnd->toDateString()])
            ->get(['mission_id', 'duration_minutes', 'rounding'])
            ->groupBy('mission_id')
            ->toBase();
    }

    /**
     * What the month has earned: the time tracked in it at the mission's rate.
     * Deliberately not "invoiced this month" — a mission billed at month end
     * would read zero for four weeks and then jump.
     *
     * A mission that prices no time (fixed price, or no rate) accrues nothing,
     * so it falls back to what it did invoice — the only figure that means
     * anything there.
     *
     * @param  Collection<int, Invoice>  $invoices
     * @param  Collection<int, TimeEntry>  $entries  tracked this month
     */
    private function earnedThisMonth(Mission $mission, Collection $invoices, Collection $entries, RevenueWindow $window): Money
    {
        if (! $this->valueTrackedTime->pricesTime($mission)) {
            return $this->sumHt(
                $invoices,
                $window,
                fn (Invoice $invoice): bool => $invoice->issued_on->between($window->monthStart, $window->monthEnd),
            );
        }

        $earned = new Money(0, $mission->currency);

        foreach ($entries as $entry) {
            $earned = $earned->add(
                $this->valueTrackedTime->measure($mission, $entry, $window->workdayMinutes)['value'],
            );
        }

        return $earned;
    }

    /**
     * The month's tracked time in the mission's own unit. Counted even when the
     * mission prices no time: effort on a fixed-price mission is exactly what
     * its margin is read from.
     *
     * @param  Collection<int, TimeEntry>  $entries  tracked this month
     * @return array{days: ?float, minutes: ?int}
     */
    private function trackedThisMonth(Mission $mission, Collection $entries, RevenueWindow $window): array
    {
        $billsByDay = $mission->billing_mode->usesDayFraction();
        $days = 0.0;
        $minutes = 0;

        foreach ($entries as $entry) {
            $quantity = $this->valueTrackedTime->quantityFor($mission, $entry, $window->workdayMinutes);
            $days += $quantity['days'] ?? 0.0;
            $minutes += $quantity['minutes'] ?? 0;
        }

        return [
            'days' => $billsByDay ? $days : null,
            'minutes' => $billsByDay ? null : $minutes,
        ];
    }

    /**
     * @param  Collection<int, Invoice>  $invoices
     */
    private function issuedThisYear(Collection $invoices, RevenueWindow $window): Money
    {
        return $this->sumHt(
            $invoices,
            $window,
            fn (Invoice $invoice): bool => $invoice->issued_on->between($window->yearStart, $window->yearEnd),
        );
    }

    /**
     * Revenue is counted HT throughout, to match the figures of the revenue
     * page — the VAT of an invoice is collected on the state's behalf and was
     * never the freelancer's turnover.
     *
     * @param  Collection<int, Invoice>  $invoices
     * @param  (callable(Invoice): bool)|null  $keep  every invoice when null
     */
    private function sumHt(Collection $invoices, RevenueWindow $window, ?callable $keep = null): Money
    {
        $total = new Money(0, $window->currency);

        foreach ($invoices as $invoice) {
            if ($keep !== null && ! $keep($invoice)) {
                continue;
            }

            $total = $total->add($invoice->amount_ht_cents);
        }

        return $total;
    }

    /**
     * Issued and still unsettled — a paid invoice has left the balance.
     *
     * Counted TTC, unlike every other figure here: this is a debt, not turnover,
     * and the client owes the VAT too. It is the same base as the "to collect"
     * total of the invoices dashboard, which the two must agree on.
     *
     * @param  Collection<int, Invoice>  $invoices
     */
    private function pending(Collection $invoices, RevenueWindow $window): Money
    {
        $total = new Money(0, $window->currency);

        foreach ($invoices as $invoice) {
            if ($invoice->status !== InvoiceStatus::Sent) {
                continue;
            }

            $total = $total->add($invoice->amount_ttc_cents);
        }

        return $total;
    }

    /**
     * The total spread over every month from the first invoice to today, dry
     * months included — a mission that billed once in January and nothing since
     * should not keep reporting January's figure as its monthly rate.
     *
     * @param  Collection<int, Invoice>  $invoices
     */
    private function monthlyAverage(Mission $mission, Collection $invoices, Money $total, RevenueWindow $window): ?MoneyData
    {
        $first = null;
        $last = null;

        foreach ($invoices as $invoice) {
            if ($first === null || $invoice->issued_on->lessThan($first)) {
                $first = $invoice->issued_on;
            }
            if ($last === null || $invoice->issued_on->greaterThan($last)) {
                $last = $invoice->issued_on;
            }
        }

        if ($first === null) {
            return null;
        }

        // A mission that is over stops accruing dry months: measured to today it
        // would decay toward zero for as long as the account exists.
        $until = $this->hasStopped($mission, $window) ? $last : null;

        return MoneyData::fromMoney(
            $total->divide($window->monthsBetween($first, $until), MoneyPhp::ROUND_HALF_UP),
        );
    }

    private function hasStopped(Mission $mission, RevenueWindow $window): bool
    {
        return $mission->status === MissionStatus::Done
            || ($mission->end_date !== null && $mission->end_date->lessThan($window->monthStart));
    }

    /**
     * @param  Collection<int, Invoice>  $invoices
     */
    private function averagePaymentDelayDays(Collection $invoices): ?int
    {
        $delays = [];

        foreach ($invoices as $invoice) {
            if ($invoice->status !== InvoiceStatus::Paid) {
                continue;
            }
            if ($invoice->paid_on === null) {
                continue;
            }
            $delays[] = (int) $invoice->issued_on->diffInDays($invoice->paid_on);
        }

        if ($delays === []) {
            return null;
        }

        return (int) round(array_sum($delays) / count($delays));
    }
}
