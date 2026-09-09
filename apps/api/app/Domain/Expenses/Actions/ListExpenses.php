<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ExpenseCategoryTotalData;
use App\Domain\Expenses\Data\ExpenseData;
use App\Domain\Expenses\Data\ExpenseMonthPointData;
use App\Domain\Expenses\Data\ExpenseRegimeProjectionData;
use App\Domain\Expenses\Data\ExpensesMonthData;
use App\Domain\Expenses\Data\ExpensesTotalsData;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Fiscality\MicroBnc;
use App\Domain\Shared\Money\Rate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;

/**
 * The journal for one month, plus the year of context around it.
 *
 * Only the shown month is hydrated as models; the trend reads the twelve
 * months ending with it as bare rows, and its last point is the month's total.
 */
class ListExpenses
{
    private const int SERIES_MONTHS = 12;

    public function handle(User $user, ?string $month): ExpensesMonthData
    {
        $settings = $user->settingsOrFail();
        $currency = $settings->currency->value;
        $monthStart = $month === null
            ? $settings->today()->startOfMonth()
            : CarbonImmutable::parse($month.'-01');

        $expenses = $user->expenses()
            ->whereBetween('spent_on', [$monthStart->toDateString(), $monthStart->endOfMonth()->toDateString()])
            ->with('media')
            ->orderByDesc('spent_on')
            ->orderByDesc('id')
            ->get();

        $series = $this->series($user, $monthStart, $currency);
        $shown = end($series);
        assert($shown instanceof ExpenseMonthPointData);

        return new ExpensesMonthData(
            month: $monthStart->format('Y-m'),
            totals: new ExpensesTotalsData(ht: $shown->ht, ttc: $shown->ttc, count: $expenses->count()),
            categories: $this->categories($expenses, $currency),
            series: $series,
            projection: $settings->hasFrenchFiscality()
                ? $this->projection($user, $monthStart, $shown->ht->toMoney())
                : null,
            expenses: array_values(ExpenseData::collect($expenses->all(), 'array')),
        );
    }

    /**
     * @param  Collection<int, Expense>  $expenses
     * @return list<ExpenseCategoryTotalData>
     */
    private function categories(Collection $expenses, string $currency): array
    {
        /** @var array<int, array{ht: int, ttc: int}> $totals */
        $totals = [];

        foreach ($expenses as $expense) {
            $key = $expense->category->value;
            $totals[$key] ??= ['ht' => 0, 'ttc' => 0];
            $totals[$key]['ht'] += (int) $expense->amount_ht_cents->getAmount();
            $totals[$key]['ttc'] += (int) $expense->amount_ttc_cents->getAmount();
        }

        uasort($totals, static fn (array $a, array $b): int => $b['ht'] <=> $a['ht']);

        $largest = $totals === [] ? 0 : reset($totals)['ht'];
        $rows = [];

        foreach ($totals as $category => $total) {
            $rows[] = new ExpenseCategoryTotalData(
                category: ExpenseCategory::from($category),
                ht: MoneyData::fromMoney(new Money($total['ht'], $currency)),
                ttc: MoneyData::fromMoney(new Money($total['ttc'], $currency)),
                shareBp: Rate::shareBp($total['ht'], $largest),
            );
        }

        return $rows;
    }

    /**
     * Bucketed in PHP rather than grouped in SQL: the three drivers spell a
     * month truncation three ways, and twelve months of receipts are a few
     * hundred rows at most.
     *
     * @return list<ExpenseMonthPointData>
     */
    private function series(User $user, CarbonImmutable $lastMonth, string $currency): array
    {
        $from = $lastMonth->subMonths(self::SERIES_MONTHS - 1);

        /** @var array<string, array{ht: int, ttc: int}> $months */
        $months = [];

        for ($month = $from; $month->lessThanOrEqualTo($lastMonth); $month = $month->addMonth()) {
            $months[$month->format('Y-m')] = ['ht' => 0, 'ttc' => 0];
        }

        /** @var Collection<int, object{spent_on: string, amount_ht_cents: int|numeric-string, amount_ttc_cents: int|numeric-string}> $rows */
        $rows = $user->expenses()
            ->toBase()
            ->whereBetween('spent_on', [$from->toDateString(), $lastMonth->endOfMonth()->toDateString()])
            ->get(['spent_on', 'amount_ht_cents', 'amount_ttc_cents']);

        foreach ($rows as $row) {
            $key = substr($row->spent_on, 0, 7);
            $months[$key] = [
                'ht' => $months[$key]['ht'] + (int) $row->amount_ht_cents,
                'ttc' => $months[$key]['ttc'] + (int) $row->amount_ttc_cents,
            ];
        }

        $points = [];

        foreach ($months as $key => $total) {
            $points[] = new ExpenseMonthPointData(
                month: $key,
                ht: MoneyData::fromMoney(new Money($total['ht'], $currency)),
                ttc: MoneyData::fromMoney(new Money($total['ttc'], $currency)),
            );
        }

        return $points;
    }

    /**
     * The month's charges as a yearly run rate against the abatement on the
     * trailing year of collections — the same cash basis the URSSAF reads.
     */
    private function projection(User $user, CarbonImmutable $monthStart, Money $monthHt): ExpenseRegimeProjectionData
    {
        $yearStart = $monthStart->subMonths(self::SERIES_MONTHS - 1);
        $monthEnd = $monthStart->endOfMonth();
        $revenueHt = new Money(
            CollectedInvoices::paidBetween($user, $yearStart, $monthEnd)->htCents($yearStart, $monthEnd),
            $monthHt->getCurrency()->getCode(),
        );
        $projected = $monthHt->multiply(self::SERIES_MONTHS);
        $abatement = MicroBnc::abatementOf($revenueHt);

        return new ExpenseRegimeProjectionData(
            projectedChargesHt: MoneyData::fromMoney($projected),
            annualRevenueHt: MoneyData::fromMoney($revenueHt),
            abatement: MoneyData::fromMoney($abatement),
            microIsFavourable: $projected->lessThan($abatement),
        );
    }
}
