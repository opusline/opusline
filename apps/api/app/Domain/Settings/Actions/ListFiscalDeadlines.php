<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Settings\Data\FiscalDeadlineData;
use App\Domain\Settings\Data\FiscalDeadlineListData;
use App\Domain\Settings\Enums\FiscalDeadlineKind;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;
use Money\Money as MoneyPhp;

/**
 * The TVA and URSSAF dates the account is on the hook for, with what each
 * period accrued.
 *
 * Amounts are on collections, matching ComputeBankProvisions: micro-régime TVA
 * and URSSAF are both cash-basis, so a period owes on what was actually paid
 * into it, not what was invoiced.
 *
 * Two due-date rules, both taken from the design canvas rather than invented
 * here — its deadline tile reads "CA3 juillet · À télérégler au 15/08", and its
 * treasury band reads "URSSAF · échéance 31/08":
 *
 *   - TVA CA3: the 15th of the month after the period
 *   - URSSAF: the last day of the month after the period
 *
 * The annual CA12 of the réel simplifié is deliberately absent. Its statutory
 * date follows the income-tax season rather than the period, the canvas does
 * not state it, and a wrong date on a tax screen costs the reader a penalty.
 * `hasUncomputedVatSchedule` says so out loud instead.
 */
class ListFiscalDeadlines
{
    private const int BASIS_POINTS = 10_000;

    /** How far back a period stays listed once its date has passed. */
    private const int OVERDUE_MONTHS_KEPT = 6;

    public function handle(User $user): FiscalDeadlineListData
    {
        $settings = $user->settingsOrFail();

        if (! $settings->hasFrenchFiscality()) {
            return new FiscalDeadlineListData(
                deadlines: [],
                hasUncomputedVatSchedule: false,
            );
        }

        $today = $settings->today();
        $currency = $settings->currency->value;
        $windowStart = $today->startOfMonth()->subMonths(self::OVERDUE_MONTHS_KEPT);

        $collected = $user->invoices()
            ->where('status', InvoiceStatus::Paid)
            ->whereBetween('paid_on', [$windowStart->toDateString(), $today->toDateString()])
            ->get(['paid_on', 'amount_ht_cents', 'amount_ttc_cents', 'currency']);

        $deadlines = [
            ...$this->vatDeadlines($settings, $collected, $today, $windowStart, $currency),
            ...$this->urssafDeadlines($settings, $collected, $today, $windowStart, $currency),
        ];

        usort(
            $deadlines,
            static fn (FiscalDeadlineData $left, FiscalDeadlineData $right): int => $left->dueOn <=> $right->dueOn,
        );

        return new FiscalDeadlineListData(
            deadlines: $deadlines,
            hasUncomputedVatSchedule: $settings->vat_regime === VatRegime::ReelSimplifie,
        );
    }

    /**
     * @param  Collection<int, Invoice>  $collected
     * @return list<FiscalDeadlineData>
     */
    private function vatDeadlines(
        UserSettings $settings,
        Collection $collected,
        CarbonImmutable $today,
        CarbonImmutable $windowStart,
        string $currency,
    ): array {
        // Franchise en base declares nothing; réel simplifié has no rule here.
        if ($settings->vat_regime !== VatRegime::ReelNormal) {
            return [];
        }

        $deadlines = [];

        for ($month = $windowStart; $month->lessThanOrEqualTo($today->startOfMonth()); $month = $month->addMonth()) {
            $vat = new Money(0, $currency);

            foreach ($this->paidIn($collected, $month, $month->endOfMonth()) as $invoice) {
                $vat = $vat->add($invoice->amount_ttc_cents->subtract($invoice->amount_ht_cents));
            }

            $deadlines[] = $this->deadline(
                kind: FiscalDeadlineKind::Vat,
                period: $month->format('Y-m'),
                dueOn: $month->addMonth()->startOfMonth()->addDays(14),
                amount: $vat,
                isPeriodOver: $month->endOfMonth()->lessThan($today),
                today: $today,
            );
        }

        return $deadlines;
    }

    /**
     * @param  Collection<int, Invoice>  $collected
     * @return list<FiscalDeadlineData>
     */
    private function urssafDeadlines(
        UserSettings $settings,
        Collection $collected,
        CarbonImmutable $today,
        CarbonImmutable $windowStart,
        string $currency,
    ): array {
        $isQuarterly = $settings->urssaf_periodicity === UrssafPeriodicity::Quarterly;
        $rateBp = $settings->effectiveContributionRateBp();

        $start = $isQuarterly ? $windowStart->firstOfQuarter() : $windowStart;
        $last = $isQuarterly ? $today->firstOfQuarter() : $today->startOfMonth();
        $deadlines = [];

        for ($period = $start; $period->lessThanOrEqualTo($last); $period = $period->addMonths($isQuarterly ? 3 : 1)) {
            $periodEnd = $isQuarterly ? $period->addMonths(2)->endOfMonth() : $period->endOfMonth();

            $collectedHt = new Money(0, $currency);

            foreach ($this->paidIn($collected, $period, $periodEnd) as $invoice) {
                $collectedHt = $collectedHt->add($invoice->amount_ht_cents);
            }

            $deadlines[] = $this->deadline(
                kind: FiscalDeadlineKind::Urssaf,
                period: $isQuarterly
                    ? sprintf('%d-Q%d', $period->year, $period->quarter)
                    : $period->format('Y-m'),
                dueOn: $periodEnd->addMonth()->endOfMonth(),
                amount: $collectedHt->multiply($rateBp)->divide(self::BASIS_POINTS, MoneyPhp::ROUND_HALF_UP),
                isPeriodOver: $periodEnd->lessThan($today),
                today: $today,
            );
        }

        return $deadlines;
    }

    /**
     * @param  Collection<int, Invoice>  $collected
     * @return list<Invoice>
     */
    private function paidIn(Collection $collected, CarbonImmutable $start, CarbonImmutable $end): array
    {
        $inPeriod = [];

        foreach ($collected as $invoice) {
            // paid_on is nullable even on a Paid row, and a period cannot claim
            // an invoice with no payment date.
            if ($invoice->paid_on === null) {
                continue;
            }

            if ($invoice->paid_on->between($start, $end)) {
                $inPeriod[] = $invoice;
            }
        }

        return $inPeriod;
    }

    private function deadline(
        FiscalDeadlineKind $kind,
        string $period,
        CarbonImmutable $dueOn,
        Money $amount,
        bool $isPeriodOver,
        CarbonImmutable $today,
    ): FiscalDeadlineData {
        $daysUntilDue = (int) $today->startOfDay()->diffInDays($dueOn->startOfDay(), false);

        return new FiscalDeadlineData(
            kind: $kind,
            period: $period,
            dueOn: $dueOn->startOfDay(),
            // A running period's figure is not the one to declare, so it is
            // withheld rather than shown as a total that will still change.
            amount: $isPeriodOver ? MoneyData::fromMoney($amount) : null,
            daysUntilDue: $daysUntilDue,
            isOverdue: $daysUntilDue < 0,
        );
    }
}
