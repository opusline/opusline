<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ExpenseCategoryTotalData;
use App\Domain\Expenses\Data\ExpenseData;
use App\Domain\Expenses\Data\ExpenseMonthPointData;
use App\Domain\Expenses\Data\ExpenseRegimeProjectionData;
use App\Domain\Expenses\Data\ExpensesMonthData;
use App\Domain\Expenses\Data\ExpensesTotalsData;
use App\Domain\Expenses\Data\ExpensesVatSummaryData;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Expenses\Vat\DeductibleExpenses;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Shared\Fiscality\MicroBnc;
use App\Domain\Shared\Money\Rate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;

/**
 * The journal for one month, plus the year of context around it.
 *
 * One query loads the month's purchases and the rows other months pushed
 * onto its CA3 — the list shows the former, the TVA summary counts both.
 * The trend reads the twelve months ending with it as bare rows, and its
 * last point is the month's total.
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
        $monthKey = $monthStart->format('Y-m');
        $monthEnd = $monthStart->endOfMonth();

        $rows = $user->expenses()
            ->with('media')
            ->where(fn ($query) => $query
                ->whereBetween('spent_on', [$monthStart->toDateString(), $monthEnd->toDateString()])
                ->orWhere('vat_claim_period', $monthKey))
            ->orderByDesc('spent_on')
            ->orderByDesc('id')
            ->get();

        $expenses = $rows->filter(fn (Expense $expense): bool => $expense->month() === $monthKey)->values();
        $declared = $settings->filesMonthlyCa3() ? DeclaredCa3Months::of($user->id) : null;

        // One load of the trailing year's collections serves the month's TVA
        // and the yearly abatement alike.
        $yearStart = $monthStart->subMonths(self::SERIES_MONTHS - 1);
        $collected = $settings->hasFrenchFiscality()
            ? CollectedInvoices::paidBetween($user, $yearStart, $monthEnd)
            : CollectedInvoices::none();

        $series = $this->series($user, $monthStart, $currency);
        $shown = end($series);
        assert($shown instanceof ExpenseMonthPointData);

        return new ExpensesMonthData(
            month: $monthKey,
            declaredOn: $declared?->declaredOn($monthKey),
            vat: $declared instanceof DeclaredCa3Months
                ? $this->vat(new DeductibleExpenses($rows, $declared), $monthKey, $collected->vatCents($monthStart, $monthEnd), $currency)
                : null,
            totals: new ExpensesTotalsData(ht: $shown->ht, ttc: $shown->ttc, count: $expenses->count()),
            categories: $this->categories($expenses, $currency),
            series: $series,
            projection: $settings->hasFrenchFiscality()
                ? $this->projection($shown->ht->toMoney(), $collected->htCents($yearStart, $monthEnd))
                : null,
            expenses: array_values(array_map(
                fn (Expense $expense): ExpenseData => ExpenseData::fromModel($expense, $declared),
                $expenses->all(),
            )),
        );
    }

    /**
     * The month's TVA as its CA3 will show it, read from the same reducer the
     * Déclarations screen uses so the two never round differently.
     *
     * @param  int  $collected  TVA collected on the invoices paid that month
     */
    private function vat(DeductibleExpenses $expenses, string $month, int $collected, string $currency): ExpensesVatSummaryData
    {
        $deductible = $expenses->goodsAndServicesVatCents($month) + $expenses->otherDeductibleVatCents($month);
        $reverseCharged = $expenses->reverseChargeVatCents($month);

        return new ExpensesVatSummaryData(
            deductible: MoneyData::fromMoney(new Money($deductible, $currency)),
            blocked: MoneyData::fromMoney(new Money($expenses->blockedVatCents($month), $currency)),
            blockedCount: $expenses->blockedCount($month),
            reverseCharged: MoneyData::fromMoney(new Money($reverseCharged, $currency)),
            deferred: MoneyData::fromMoney(new Money($expenses->deferredVatCents($month), $currency)),
            collected: MoneyData::fromMoney(new Money($collected, $currency)),
            balance: SignedMoneyData::fromMoney(new Money($collected + $reverseCharged - $deductible, $currency)),
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
    private function projection(Money $monthHt, int $annualRevenueHtCents): ExpenseRegimeProjectionData
    {
        $revenueHt = new Money($annualRevenueHtCents, $monthHt->getCurrency()->getCode());
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
