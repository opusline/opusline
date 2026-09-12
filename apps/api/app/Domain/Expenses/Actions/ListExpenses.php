<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Actions;

use App\Domain\Expenses\Data\ExpenseCategoryTotalData;
use App\Domain\Expenses\Data\ExpenseData;
use App\Domain\Expenses\Data\ExpenseMonthPointData;
use App\Domain\Expenses\Data\ExpenseRegimeProjectionData;
use App\Domain\Expenses\Data\ExpensesMonthData;
use App\Domain\Expenses\Data\ExpensesSubscriptionsData;
use App\Domain\Expenses\Data\ExpensesTotalsData;
use App\Domain\Expenses\Data\ExpensesVatSummaryData;
use App\Domain\Expenses\Data\ExpenseTodoData;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseTodoKind;
use App\Domain\Expenses\Enums\SubscriptionPeriodicity;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Expenses\Subscriptions\OccurrenceSchedule;
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
use Money\Money as MoneyPhp;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

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

    /** How far ahead the rail warns of an annual debit. */
    private const int UPCOMING_DAYS = 30;

    public function __construct(private readonly MaterialiseSubscriptionOccurrences $materialiseSubscriptionOccurrences) {}

    public function handle(User $user, ?string $month): ExpensesMonthData
    {
        $settings = $user->settingsOrFail();
        $currency = $settings->currency->value;
        $today = $settings->today();
        $monthStart = $month === null
            ? $today->startOfMonth()
            : CarbonImmutable::parse($month.'-01');
        $monthKey = $monthStart->format('Y-m');
        $monthEnd = $monthStart->endOfMonth();

        $this->materialiseSubscriptionOccurrences->handle($user, $today);

        $rows = $user->expenses()
            ->with(['media', 'subscription'])
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

        $subscriptions = $user->subscriptions()->with('amounts')->get()
            ->filter(static fn (Subscription $subscription): bool => $subscription->stillDebitsAfter($today));
        $tile = $subscriptions->isEmpty() ? null : $this->subscriptions($subscriptions, $today, $currency);

        return new ExpensesMonthData(
            month: $monthKey,
            declaredOn: $declared?->declaredOn($monthKey),
            vat: $declared instanceof DeclaredCa3Months
                ? $this->vat(new DeductibleExpenses($rows, $declared), $monthKey, $collected->vatCents($monthStart, $monthEnd), $currency)
                : null,
            totals: new ExpensesTotalsData(ht: $shown->ht, ttc: $shown->ttc, count: $expenses->count()),
            subscriptions: $tile,
            categories: $this->categories($expenses, $currency),
            series: $series,
            projection: $settings->hasFrenchFiscality()
                ? $this->projection($this->yearlyChargesHt($expenses, $shown->ht->toMoney(), $tile), $collected->htCents($yearStart, $monthEnd))
                : null,
            todo: [...$this->missingReceiptCards($expenses), ...$this->upcomingAnnualCards($subscriptions, $today)],
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
        /** @var array<string, array{category: ?ExpenseCategory, ht: int, ttc: int}> $totals */
        $totals = [];

        foreach ($expenses as $expense) {
            // A subscription's debit files under « Abonnements » whatever it buys — the bar answers "what do my subscriptions cost".
            $category = $expense->subscription_id === null ? $expense->category : null;
            $key = $category === null ? 'subscriptions' : $category->name;
            $totals[$key] ??= ['category' => $category, 'ht' => 0, 'ttc' => 0];
            $totals[$key]['ht'] += (int) $expense->amount_ht_cents->getAmount();
            $totals[$key]['ttc'] += (int) $expense->amount_ttc_cents->getAmount();
        }

        uasort($totals, static fn (array $a, array $b): int => $b['ht'] <=> $a['ht']);

        $largest = $totals === [] ? 0 : reset($totals)['ht'];
        $rows = [];

        foreach ($totals as $total) {
            $rows[] = new ExpenseCategoryTotalData(
                category: $total['category'],
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
     * The subscriptions still debiting, as the journal's tile reads them:
     * spread evenly over the year at today's prices.
     *
     * @param  Collection<int, Subscription>  $subscriptions
     */
    private function subscriptions(Collection $subscriptions, CarbonImmutable $today, string $currency): ExpensesSubscriptionsData
    {
        $yearlyHt = $yearlyTtc = new Money(0, $currency);
        $annualCount = 0;

        foreach ($subscriptions as $subscription) {
            $amounts = $subscription->amountsOn($today);
            $perYear = $subscription->periodicity->occurrencesPerYear();
            $yearlyHt = $yearlyHt->add($amounts->ht->multiply($perYear));
            $yearlyTtc = $yearlyTtc->add($amounts->ttc->multiply($perYear));

            if ($subscription->periodicity === SubscriptionPeriodicity::Annual) {
                $annualCount++;
            }
        }

        return new ExpensesSubscriptionsData(
            monthlyHt: MoneyData::fromMoney($yearlyHt->divide(12, MoneyPhp::ROUND_HALF_UP)),
            monthlyTtc: MoneyData::fromMoney($yearlyTtc->divide(12, MoneyPhp::ROUND_HALF_UP)),
            yearlyHt: MoneyData::fromMoney($yearlyHt),
            yearlyTtc: MoneyData::fromMoney($yearlyTtc),
            count: $subscriptions->count(),
            annualCount: $annualCount,
        );
    }

    /**
     * The year's charges as the régime comparison needs them: the month's
     * one-off purchases as a yearly run rate, plus a year of the
     * subscriptions still debiting — the month's own debits stay out of the
     * run rate, or an annual one would count twelve times in its month.
     *
     * @param  Collection<int, Expense>  $expenses
     */
    private function yearlyChargesHt(Collection $expenses, Money $monthHt, ?ExpensesSubscriptionsData $tile): Money
    {
        $debitsHt = $expenses
            ->filter(static fn (Expense $expense): bool => $expense->subscription_id !== null)
            ->reduce(static fn (int $total, Expense $expense): int => $total + (int) $expense->amount_ht_cents->getAmount(), 0);
        $oneOffs = $monthHt->subtract(new Money($debitsHt, $monthHt->getCurrency()->getCode()));

        return $oneOffs->multiply(self::SERIES_MONTHS)->add($tile?->yearlyHt->toMoney() ?? new Money(0, $monthHt->getCurrency()->getCode()));
    }

    /**
     * @param  Collection<int, Expense>  $expenses
     * @return list<ExpenseTodoData>
     */
    private function missingReceiptCards(Collection $expenses): array
    {
        $cards = [];

        foreach ($expenses as $expense) {
            if ($expense->subscription_id === null) {
                continue;
            }
            if ($expense->receipt() instanceof Media) {
                continue;
            }
            $cards[] = new ExpenseTodoData(
                kind: ExpenseTodoKind::MissingReceipt,
                expenseId: $expense->id,
                subscriptionId: $expense->subscription_id,
                bankMovementId: null,
                label: $expense->supplier,
                amount: MoneyData::fromMoney($expense->amount_ttc_cents),
                date: $expense->spent_on,
            );
        }

        return $cards;
    }

    /**
     * @param  Collection<int, Subscription>  $subscriptions
     * @return list<ExpenseTodoData>
     */
    private function upcomingAnnualCards(Collection $subscriptions, CarbonImmutable $today): array
    {
        $horizon = $today->addDays(self::UPCOMING_DAYS);
        $cards = [];

        foreach ($subscriptions as $subscription) {
            if ($subscription->periodicity !== SubscriptionPeriodicity::Annual) {
                continue;
            }

            $nextDebitOn = new OccurrenceSchedule($subscription)->nextDebitOn($today);
            if (! $nextDebitOn instanceof CarbonImmutable) {
                continue;
            }
            if ($nextDebitOn->greaterThan($horizon)) {
                continue;
            }

            $cards[] = new ExpenseTodoData(
                kind: ExpenseTodoKind::UpcomingAnnualDebit,
                expenseId: null,
                subscriptionId: $subscription->id,
                bankMovementId: null,
                label: $subscription->supplier,
                amount: MoneyData::fromMoney($subscription->amountsOn($nextDebitOn)->ttc),
                date: $nextDebitOn,
            );
        }

        return $cards;
    }

    /**
     * The year's charges against the abatement on the trailing year of
     * collections — the same cash basis the URSSAF reads.
     */
    private function projection(Money $projected, int $annualRevenueHtCents): ExpenseRegimeProjectionData
    {
        $revenueHt = new Money($annualRevenueHtCents, $projected->getCurrency()->getCode());
        $abatement = MicroBnc::abatementOf($revenueHt);

        return new ExpenseRegimeProjectionData(
            projectedChargesHt: MoneyData::fromMoney($projected),
            annualRevenueHt: MoneyData::fromMoney($revenueHt),
            abatement: MoneyData::fromMoney($abatement),
            microIsFavourable: $projected->lessThan($abatement),
        );
    }
}
