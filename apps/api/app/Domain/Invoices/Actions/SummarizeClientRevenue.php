<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Data\ClientRevenueData;
use App\Domain\Invoices\Data\ClientRevenueListData;
use App\Domain\Invoices\Data\MissionRevenueData;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;
use Money\Money as MoneyPhp;

/**
 * Per-client and per-mission revenue for the clients listing and the client and
 * mission detail headers.
 *
 * The whole ledger is read once and folded in PHP rather than aggregated per
 * client in SQL: a freelancer's invoice count is small, this keeps the query
 * count at two whatever the client count, and it avoids date arithmetic that
 * differs between the MySQL of production and the SQLite of the test suite.
 */
class SummarizeClientRevenue
{
    public function handle(User $user): ClientRevenueListData
    {
        $settings = $user->settingsOrFail();
        $today = $settings->today();
        $currency = $settings->currency->value;

        $invoicesByClient = $user->invoices()
            ->whereIn('status', [InvoiceStatus::Sent, InvoiceStatus::Paid])
            ->get(['client_id', 'mission_id', 'status', 'issued_on', 'paid_on', 'amount_ht_cents', 'currency'])
            ->groupBy('client_id');

        $clients = $user->clients()
            ->with('missions:id,client_id')
            ->orderBy('name')
            ->get(['id']);

        $rows = $clients->map(fn (Client $client): ClientRevenueData => $this->forClient(
            $client,
            $invoicesByClient->get($client->id) ?? new Collection,
            $today,
            $currency,
        ));

        return new ClientRevenueListData(
            year: $today->year,
            clients: array_values($rows->all()),
        );
    }

    /**
     * @param  Collection<int, Invoice>  $invoices
     */
    private function forClient(Client $client, Collection $invoices, CarbonImmutable $today, string $currency): ClientRevenueData
    {
        $byMission = $invoices->groupBy('mission_id');

        $missions = $client->missions->map(function (Mission $mission) use ($byMission, $today, $currency): MissionRevenueData {
            /** @var Collection<int, Invoice> $billed */
            $billed = $byMission->get($mission->id) ?? new Collection;
            $total = $this->totalOf($billed, $currency);

            return new MissionRevenueData(
                missionId: $mission->id,
                yearToDate: MoneyData::fromMoney(
                    $this->issuedBetween($billed, $today->startOfYear(), $today->endOfYear(), $currency),
                ),
                currentMonth: MoneyData::fromMoney(
                    $this->issuedBetween($billed, $today->startOfMonth(), $today->endOfMonth(), $currency),
                ),
                total: MoneyData::fromMoney($total),
                monthlyAverage: $this->monthlyAverage($billed, $total, $today),
            );
        });

        return new ClientRevenueData(
            clientId: $client->id,
            yearToDate: MoneyData::fromMoney(
                $this->issuedBetween($invoices, $today->startOfYear(), $today->endOfYear(), $currency),
            ),
            pending: MoneyData::fromMoney($this->pending($invoices, $currency)),
            averagePaymentDelayDays: $this->averagePaymentDelayDays($invoices),
            missions: array_values($missions->all()),
        );
    }

    /**
     * @param  Collection<int, Invoice>  $invoices
     */
    private function issuedBetween(Collection $invoices, CarbonImmutable $start, CarbonImmutable $end, string $currency): Money
    {
        $total = new Money(0, $currency);

        foreach ($invoices as $invoice) {
            if ($invoice->issued_on->between($start, $end)) {
                $total = $total->add($invoice->amount_ht_cents);
            }
        }

        return $total;
    }

    /**
     * @param  Collection<int, Invoice>  $invoices
     */
    private function totalOf(Collection $invoices, string $currency): Money
    {
        $total = new Money(0, $currency);

        foreach ($invoices as $invoice) {
            $total = $total->add($invoice->amount_ht_cents);
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
    private function monthlyAverage(Collection $invoices, Money $total, CarbonImmutable $today): ?MoneyData
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

        $months = $first->startOfMonth()->diffInMonths($today->startOfMonth()) + 1;

        return MoneyData::fromMoney($total->divide((int) $months, MoneyPhp::ROUND_HALF_UP));
    }

    /**
     * Issued and still unsettled. A paid invoice has left the balance and a
     * draft never entered it.
     *
     * @param  Collection<int, Invoice>  $invoices
     */
    private function pending(Collection $invoices, string $currency): Money
    {
        $total = new Money(0, $currency);

        foreach ($invoices as $invoice) {
            if ($invoice->status === InvoiceStatus::Sent) {
                $total = $total->add($invoice->amount_ht_cents);
            }
        }

        return $total;
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
