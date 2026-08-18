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
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Money\Money as MoneyPhp;

/**
 * @phpstan-type Period array{kind: 'month'|'quarter'|'year', key: string, start: CarbonImmutable, end: CarbonImmutable}
 */
class SummarizeRevenue
{
    private const int BASIS_POINTS = 10_000;

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
        $total = $this->totalOf($invoices, $currency);

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
     * @return list<InvoiceStatus>
     */
    private function statuses(RevenueBasis $basis): array
    {
        // A draft is not a document yet, so it never counts as revenue.
        return $basis === RevenueBasis::Collected
            ? [InvoiceStatus::Paid]
            : [InvoiceStatus::Sent, InvoiceStatus::Paid];
    }

    private function dateColumn(RevenueBasis $basis): string
    {
        return $basis === RevenueBasis::Collected ? 'paid_on' : 'issued_on';
    }

    /**
     * The basis's slice of the ledger: issued or paid inside the bounds.
     *
     * @return HasMany<Invoice, User>
     */
    private function invoicesBetween(User $user, RevenueBasis $basis, CarbonImmutable $start, CarbonImmutable $end): HasMany
    {
        return $user->invoices()
            ->whereIn('status', $this->statuses($basis))
            ->whereBetween($this->dateColumn($basis), [$start->toDateString(), $end->toDateString()]);
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
        $latest = $user->invoices()
            ->whereIn('status', $this->statuses($basis))
            ->max($this->dateColumn($basis));

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
                : intdiv(((int) $total->getAmount() - $previousAmount) * self::BASIS_POINTS, $previousAmount),
        );
    }

    /**
     * @param  Period  $period
     */
    private function totalBetween(User $user, RevenueBasis $basis, array $period, string $currency): Money
    {
        $invoices = $this->invoicesBetween($user, $basis, $period['start'], $period['end'])
            ->get(['amount_ht_cents', 'currency']);

        return $this->totalOf($invoices, $currency);
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

        // A period with nothing in it still reads as the account's rate; only invoices
        // that genuinely disagree drop the caption.
        $rates = $invoices
            ->map(static fn (Invoice $invoice): int => $invoice->vat_rate_bp)
            ->unique();

        $rateBp = match ($rates->count()) {
            0 => $settings->default_vat_rate_bp,
            1 => $rates->first(),
            default => null,
        };

        return new RevenueVatData(
            amount: MoneyData::fromMoney($total),
            rateBp: $rateBp,
        );
    }

    private function net(UserSettings $settings, Money $total): ?RevenueNetData
    {
        if (! $settings->hasFrenchFiscality()) {
            return null;
        }

        $rateBp = $settings->effectiveContributionRateBp();
        $contributions = $total->multiply($rateBp)->divide(self::BASIS_POINTS, MoneyPhp::ROUND_HALF_UP);

        return new RevenueNetData(
            amount: MoneyData::fromMoney($total->subtract($contributions)),
            contributions: MoneyData::fromMoney($contributions),
            rateBp: $rateBp,
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

        $column = $this->dateColumn($basis);
        $invoices = $this->invoicesBetween($user, $basis, $firstMonth, $period['end'])
            ->get([$column, 'amount_ht_cents', 'currency']);

        foreach ($invoices as $invoice) {
            /** @var CarbonImmutable $date */
            $date = $invoice->{$column};
            $key = $date->format('Y-m');
            $totals[$key] = $totals[$key]->add($invoice->amount_ht_cents);
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
                shareBp: $largest === 0 ? 0 : intdiv($amount * self::BASIS_POINTS, $largest),
            );
        }

        return $bars;
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
                    shareBp: $grandTotal === 0 ? 0 : intdiv($amount * self::BASIS_POINTS, $grandTotal),
                );
            })
            ->sortByDesc(static fn (RevenueClientData $row): int => $row->total->amount)
            ->all();

        return array_values($rows);
    }
}
