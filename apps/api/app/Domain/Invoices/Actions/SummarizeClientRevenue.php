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
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Money\Money as MoneyPhp;

/**
 * Per-client and per-mission invoiced revenue, for the clients listing and for
 * the client and mission detail headers.
 *
 * The ledger is read once and folded in PHP rather than aggregated per client
 * in SQL: a freelancer's invoice count is small, it keeps the query count fixed
 * whatever the client count, and it avoids date arithmetic that differs between
 * the MySQL of production and the SQLite of the test suite.
 */
class SummarizeClientRevenue
{
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

    public function handle(User $user): ClientRevenueListData
    {
        $window = $this->windowFor($user);

        $invoicesByClient = $this->billedInvoices($user)->get(self::INVOICE_COLUMNS)->groupBy('client_id');

        $clients = $user->clients()
            ->with('missions:id,client_id')
            ->orderBy('name')
            ->get(['id']);

        $rows = $clients->map(fn (Client $client): ClientRevenueData => $this->forClient(
            $client,
            $invoicesByClient->get($client->id) ?? new Collection,
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

        $client->loadMissing('missions:id,client_id');

        return new ClientRevenueDetailData(
            year: $window->year,
            revenue: $this->forClient($client, $invoices, $window),
        );
    }

    public function forOneMission(User $user, Mission $mission): MissionRevenueData
    {
        $invoices = $this->billedInvoices($user)
            ->where('mission_id', $mission->id)
            ->get(self::INVOICE_COLUMNS);

        return $this->forMission($mission->id, $invoices, $this->windowFor($user));
    }

    private function windowFor(User $user): RevenueWindow
    {
        $settings = $user->settingsOrFail();

        return RevenueWindow::around($settings->today(), $settings->currency->value);
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
     */
    private function forClient(Client $client, Collection $invoices, RevenueWindow $window): ClientRevenueData
    {
        $byMission = $invoices->groupBy('mission_id');

        $rows = $client->missions->map(fn (Mission $mission): MissionRevenueData => $this->forMission(
            $mission->id,
            $byMission->get($mission->id) ?? new Collection,
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
     */
    private function forMission(int $missionId, Collection $invoices, RevenueWindow $window): MissionRevenueData
    {
        $total = $this->sumHt($invoices, $window);

        return new MissionRevenueData(
            missionId: $missionId,
            yearToDate: MoneyData::fromMoney($this->issuedThisYear($invoices, $window)),
            currentMonth: MoneyData::fromMoney($this->sumHt(
                $invoices,
                $window,
                fn (Invoice $invoice): bool => $invoice->issued_on->between($window->monthStart, $window->monthEnd),
            )),
            total: MoneyData::fromMoney($total),
            monthlyAverage: $this->monthlyAverage($invoices, $total, $window),
        );
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
    private function monthlyAverage(Collection $invoices, Money $total, RevenueWindow $window): ?MoneyData
    {
        $first = null;

        foreach ($invoices as $invoice) {
            if ($first === null || $invoice->issued_on->lessThan($first)) {
                $first = $invoice->issued_on;
            }
        }

        if ($first === null) {
            return null;
        }

        return MoneyData::fromMoney(
            $total->divide($window->monthsSince($first), MoneyPhp::ROUND_HALF_UP),
        );
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
