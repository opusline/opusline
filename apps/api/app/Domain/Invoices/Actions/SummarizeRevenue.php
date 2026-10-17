<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\InvoiceListItemData;
use App\Domain\Invoices\Data\RevenueClientData;
use App\Domain\Invoices\Data\RevenueComparisonData;
use App\Domain\Invoices\Data\RevenueData;
use App\Domain\Invoices\Data\RevenueMonthData;
use App\Domain\Invoices\Data\RevenueNetData;
use App\Domain\Invoices\Data\RevenueVatData;
use App\Domain\Invoices\Data\SummarizeRevenueData;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\RevenueBasis;
use App\Domain\Invoices\Models\CreditNote;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoicePayment;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Money\Rate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

/**
 * @phpstan-type Period array{kind: 'month'|'quarter'|'year', key: string, start: CarbonImmutable, end: CarbonImmutable}
 */
class SummarizeRevenue
{
    private const int CHART_MONTHS = 8;

    public function handle(User $user, SummarizeRevenueData $data): RevenueData
    {
        $settings = $user->settingsOrFail();
        $basis = $data->basis ?? RevenueBasis::Invoiced;

        $period = $this->parsePeriod($data->period ?? $settings->today()->format('Y-m'));
        $lastActive = $this->lastActivePeriod($user, $basis, $period['kind']);
        $invoices = $this->invoicesIn($user, $basis, $period);
        $fellBack = false;

        // A bare load should never open on an empty screen while there is history to
        // show. An explicit period is a question about that period; it gets its zeros.
        if ($data->period === null && $invoices->isEmpty() && $lastActive !== null) {
            $period = $this->parsePeriod($lastActive);
            $invoices = $this->invoicesIn($user, $basis, $period);
            $fellBack = true;
        }

        $currency = $settings->currency->value;
        $total = $basis === RevenueBasis::Collected
            ? $this->collectedHtBetween($user, $period['start'], $period['end'], $currency)
            : $this->totalOf($invoices, $currency)->subtract($this->creditedHtBetween($user, $period['start'], $period['end'], $currency));

        return new RevenueData(
            period: $period['key'],
            basis: $basis,
            fellBack: $fellBack,
            lastActivePeriod: $lastActive,
            total: MoneyData::fromMoney($total),
            previous: $this->previous($user, $basis, $period, $total, $currency),
            vat: $this->vat($settings, $invoices, $currency),
            net: $this->net($settings, $total),
            months: $this->months($user, $basis, $period, $currency),
            invoices: array_values(InvoiceListItemData::collect($invoices, 'array')),
            clients: $this->clients($invoices, $total, $currency),
        );
    }

    /**
     * @return Period
     */
    private function parsePeriod(string $key): array
    {
        if (preg_match('/^(\d{4})-Q([1-4])$/', $key, $matches) === 1) {
            $start = CarbonImmutable::parse(sprintf('%s-%02d-01', $matches[1], ((int) $matches[2] - 1) * 3 + 1));

            return ['kind' => 'quarter', 'key' => $key, 'start' => $start, 'end' => $start->addMonths(2)->endOfMonth()];
        }

        if (preg_match('/^\d{4}$/', $key) === 1) {
            $start = CarbonImmutable::parse($key.'-01-01');

            return ['kind' => 'year', 'key' => $key, 'start' => $start, 'end' => $start->endOfYear()];
        }

        $start = CarbonImmutable::parse($key.'-01');

        return ['kind' => 'month', 'key' => $key, 'start' => $start, 'end' => $start->endOfMonth()];
    }

    /**
     * @param  'month'|'quarter'|'year'  $kind
     */
    private function keyFor(string $kind, CarbonImmutable $date): string
    {
        return match ($kind) {
            'month' => $date->format('Y-m'),
            'quarter' => sprintf('%d-Q%d', $date->year, $date->quarter),
            'year' => $date->format('Y'),
        };
    }

    /**
     * A draft is not a document yet, so it never counts as revenue; a partly paid
     * invoice has collected something. A cancelled one was invoiced too: its credit
     * note takes it back, in the month the credit note was issued.
     */
    private const array REVENUE_STATUSES = [InvoiceStatus::Sent, InvoiceStatus::Paid, InvoiceStatus::Cancelled];

    /** The column the rows are ordered on: the day the last payment landed, or the issue date. */
    private function dateColumn(RevenueBasis $basis): string
    {
        return $basis === RevenueBasis::Collected ? 'last_paid_on' : 'issued_on';
    }

    /**
     * The basis's slice of the ledger: issued inside the bounds, or with money
     * landed inside them. Collected rows are invoices, their amounts whole; the
     * collected totals are the payments' shares (collectedHtBetween), so the two
     * agree whenever an invoice is paid in one go.
     *
     * @return HasMany<Invoice, User>
     */
    private function invoicesBetween(User $user, RevenueBasis $basis, CarbonImmutable $start, CarbonImmutable $end): HasMany
    {
        $bounds = [$start->toDateString(), $end->toDateString()];
        $invoices = $user->invoices()->withPaymentFigures()->whereIn('status', self::REVENUE_STATUSES);

        if ($basis === RevenueBasis::Collected) {
            return $invoices->whereHas(
                'payments',
                /** @param Builder<InvoicePayment> $payments */
                static function (Builder $payments) use ($bounds): void {
                    $payments->whereBetween('paid_on', $bounds);
                },
            );
        }

        return $invoices->whereBetween('issued_on', $bounds);
    }

    /**
     * @param  Period  $period
     * @return Collection<int, Invoice>
     */
    private function invoicesIn(User $user, RevenueBasis $basis, array $period): Collection
    {
        return $this->invoicesBetween($user, $basis, $period['start'], $period['end'])
            ->with(['client', 'mission'])
            ->orderByDesc($this->dateColumn($basis))
            ->orderByDesc('id')
            ->get();
    }

    /**
     * @param  'month'|'quarter'|'year'  $kind
     */
    private function lastActivePeriod(User $user, RevenueBasis $basis, string $kind): ?string
    {
        $latest = $basis === RevenueBasis::Collected
            ? $user->invoicePayments()->max('paid_on')
            : $user->invoices()->whereIn('status', self::REVENUE_STATUSES)->max('issued_on');

        return is_string($latest) ? $this->keyFor($kind, CarbonImmutable::parse($latest)) : null;
    }

    /**
     * @param  Period  $period
     */
    private function previous(User $user, RevenueBasis $basis, array $period, Money $total, string $currency): RevenueComparisonData
    {
        $previous = $this->parsePeriod($this->keyFor($period['kind'], match ($period['kind']) {
            'month' => $period['start']->subMonth(),
            'quarter' => $period['start']->subMonths(3),
            'year' => $period['start']->subYear(),
        }));

        $previousTotal = $this->totalBetween($user, $basis, $previous, $currency);
        $previousAmount = (int) $previousTotal->getAmount();

        return new RevenueComparisonData(
            period: $previous['key'],
            total: MoneyData::fromMoney($previousTotal),
            changeBp: $previousAmount === 0
                ? null
                : Rate::shareBp((int) $total->getAmount() - $previousAmount, $previousAmount),
        );
    }

    /**
     * @param  Period  $period
     */
    private function totalBetween(User $user, RevenueBasis $basis, array $period, string $currency): Money
    {
        if ($basis === RevenueBasis::Collected) {
            return $this->collectedHtBetween($user, $period['start'], $period['end'], $currency);
        }

        $invoiced = new Money((int) $this->invoicesBetween($user, $basis, $period['start'], $period['end'])->sum('amount_ht_cents'), $currency);

        return $invoiced->subtract($this->creditedHtBetween($user, $period['start'], $period['end'], $currency));
    }

    /** The HT the credit notes issued between the bounds took off what was invoiced. */
    private function creditedHtBetween(User $user, CarbonImmutable $start, CarbonImmutable $end, string $currency): Money
    {
        return new Money(
            (int) $user->creditNotes()->whereBetween('issued_on', [$start->toDateString(), $end->toDateString()])->sum('amount_ht_cents'),
            $currency,
        );
    }

    /** The HT the payments landed between the bounds collected: the cash-basis figure. */
    private function collectedHtBetween(User $user, CarbonImmutable $start, CarbonImmutable $end, string $currency): Money
    {
        return new Money(CollectedInvoices::paidBetween($user, $start, $end)->htCents($start, $end), $currency);
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
     * @param  Collection<int, Invoice>  $invoices
     */
    private function vat(UserSettings $settings, Collection $invoices, string $currency): ?RevenueVatData
    {
        if (! $settings->vat_regime->isLiable()) {
            return null;
        }

        $total = new Money(0, $currency);

        foreach ($invoices as $invoice) {
            $total = $total->add($invoice->vatAmount());
        }

        return new RevenueVatData(
            amount: MoneyData::fromMoney($total),
            rateBp: CollectedInvoices::consensusRateBp(
                $invoices->map(static fn (Invoice $invoice): int => $invoice->vat_rate_bp),
                $settings->default_vat_rate_bp,
            ),
        );
    }

    private function net(UserSettings $settings, Money $total): ?RevenueNetData
    {
        if (! $settings->hasFrenchFiscality()) {
            return null;
        }

        $contributions = $settings->urssafContributionsOn($total);

        return new RevenueNetData(
            amount: MoneyData::fromMoney($total->subtract($contributions)),
            contributions: MoneyData::fromMoney($contributions),
            rateBp: $settings->effectiveContributionRateBp(),
        );
    }

    /**
     * The chart stays monthly whatever the period kind — a quarter or a year is read
     * through its months. The window is the year's twelve months, or the eight months
     * ending where the period does.
     *
     * @param  Period  $period
     * @return list<RevenueMonthData>
     */
    private function months(User $user, RevenueBasis $basis, array $period, string $currency): array
    {
        $lastMonth = $period['end']->startOfMonth();
        $firstMonth = $period['kind'] === 'year'
            ? $period['start']
            : $lastMonth->subMonths(self::CHART_MONTHS - 1);

        /** @var array<string, Money> $totals */
        $totals = [];

        for ($month = $firstMonth; $month->lessThanOrEqualTo($lastMonth); $month = $month->addMonth()) {
            $totals[$month->format('Y-m')] = new Money(0, $currency);
        }

        foreach ($this->monthlyAmounts($user, $basis, $firstMonth, $period['end']) as [$date, $amount]) {
            $key = $date->format('Y-m');
            $totals[$key] = $totals[$key]->add($amount);
        }

        $largest = 0;

        foreach ($totals as $total) {
            $largest = max($largest, (int) $total->getAmount());
        }

        $periodStart = $period['start']->format('Y-m');
        $periodEnd = $period['end']->format('Y-m');
        $bars = [];

        foreach ($totals as $month => $total) {
            $amount = (int) $total->getAmount();

            $bars[] = new RevenueMonthData(
                month: $month,
                total: MoneyData::fromMoney($total),
                inPeriod: $month >= $periodStart && $month <= $periodEnd,
                shareBp: Rate::shareBp($amount, $largest),
            );
        }

        return $bars;
    }

    /**
     * Each amount the chart buckets, with the day it belongs to: a payment's HT
     * share on the day it landed, or an invoice's HT on the day it was issued.
     *
     * @return list<array{CarbonImmutable, Money}>
     */
    private function monthlyAmounts(User $user, RevenueBasis $basis, CarbonImmutable $start, CarbonImmutable $end): array
    {
        $bounds = [$start->toDateString(), $end->toDateString()];

        if ($basis === RevenueBasis::Collected) {
            return array_values($user->invoicePayments()
                ->whereBetween('paid_on', $bounds)
                ->with(['invoice:id,amount_ht_cents,amount_ttc_cents,currency', 'creditNote:id,amount_ht_cents,amount_ttc_cents,currency'])
                ->get()
                ->map(static fn (InvoicePayment $payment): array => [$payment->paid_on, $payment->htShare()])
                ->all());
        }

        $invoiced = $user->invoices()
            ->whereIn('status', self::REVENUE_STATUSES)
            ->whereBetween('issued_on', $bounds)
            ->get(['issued_on', 'amount_ht_cents', 'currency'])
            ->map(static fn (Invoice $invoice): array => [$invoice->issued_on, $invoice->amount_ht_cents]);
        // A credit note takes its HT off the month it was issued in.
        $credited = $user->creditNotes()
            ->whereBetween('issued_on', $bounds)
            ->get(['issued_on', 'amount_ht_cents', 'currency'])
            ->map(static fn (CreditNote $creditNote): array => [$creditNote->issued_on, $creditNote->amount_ht_cents->negative()]);

        return [...array_values($invoiced->all()), ...array_values($credited->all())];
    }

    /**
     * @param  Collection<int, Invoice>  $invoices
     * @return list<RevenueClientData>
     */
    private function clients(Collection $invoices, Money $total, string $currency): array
    {
        $grandTotal = (int) $total->getAmount();

        $rows = $invoices
            ->groupBy('client_id')
            ->map(function (Collection $group) use ($grandTotal, $currency): RevenueClientData {
                $client = $group->firstOrFail()->client;
                $groupTotal = $this->totalOf($group, $currency);
                $amount = (int) $groupTotal->getAmount();

                return new RevenueClientData(
                    clientId: $client->id,
                    clientName: $client->name,
                    color: $client->color,
                    invoiceCount: $group->count(),
                    total: MoneyData::fromMoney($groupTotal),
                    shareBp: Rate::shareBp($amount, $grandTotal),
                );
            })
            ->sortByDesc(static fn (RevenueClientData $row): int => $row->total->amount)
            ->all();

        return array_values($rows);
    }
}
