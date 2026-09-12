<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankProvisionData;
use App\Domain\Bank\Data\BankProvisionsData;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Deadlines\Actions\ResolveExpectedCfe;
use App\Domain\Deadlines\Calendar\CfeSchedule;
use App\Domain\Deadlines\Calendar\ExpectedCfe;
use App\Domain\Declarations\Vat\Ca3Chain;
use App\Domain\Declarations\Vat\Ca3ChainStart;
use App\Domain\Expenses\Subscriptions\OccurrenceSchedule;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Expenses\Vat\DeductibleExpenses;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Settings\Rates\ContributionRateHistory;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Money\Rate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;
use Money\Money as MoneyPhp;

/**
 * What the fisc is still owed, computed on collections (encaissements)
 * because micro-régime TVA and URSSAF are both cash-basis:
 *
 * - the running period's accrual: what its CA3 (réel normal) or CA12 (réel
 *   simplifié) will owe — TVA collected on the invoices paid inside it, less
 *   the deductions its receipted purchases earn; the CA3 is read off the same
 *   chain of returns the Déclarations screen shows, so a credit carried from
 *   the previous month lowers it too (null under the franchise en base; a
 *   foreign account deducts nothing, as its journal tracks no TVA) — and the
 *   URSSAF contributions on the HT collected inside it (month or quarter
 *   per the settings; null outside French fiscality);
 * - plus the previous period's accrual, carried until the matching payment
 *   shows up in the imported movements — France pays in arrears, so the
 *   URSSAF prélèvement or TVA télérèglement detected in the current period
 *   settles that carried debt, clamped at zero. The carry is priced at the rate
 *   that applied when the period closed, not today's: an ACRE step ending in
 *   January must not reprice the December that is still owed;
 * - plus a twelfth of the expected CFE per elapsed month, netted the same way
 *   against detected CFE debits;
 * - plus, for each annual subscription the user chose to spread, a twelfth of
 *   its debit per month elapsed since the last one;
 * - plus the matelas as configured, verbatim.
 */
class ComputeBankProvisions
{
    public function __construct(
        private readonly ResolveExpectedCfe $resolveExpectedCfe,
        private readonly ContributionRateHistory $contributionRateHistory,
    ) {}

    public function handle(User $user): BankProvisionsData
    {
        $settings = $user->settingsOrFail();
        $currency = $settings->currency->value;
        $today = $settings->today();

        $vatPeriod = $this->vatPeriod($settings, $today);
        $urssafPeriod = $this->urssafPeriod($settings, $today);
        $declared = $vatPeriod !== null && $settings->hasFrenchFiscality() ? DeclaredCa3Months::of($user->id) : null;
        $chainStart = $declared instanceof DeclaredCa3Months && $settings->filesMonthlyCa3()
            ? Ca3ChainStart::resolve($user, $settings, $declared, $vatPeriod['previousStart'])
            : null;
        $collected = $this->collectedInvoices($user, $today, $vatPeriod, $urssafPeriod, $chainStart);
        $fiscDebits = $this->fiscDebits($user, $settings, $vatPeriod, $urssafPeriod, $today);

        $vat = $vatPeriod === null
            ? null
            : $this->vat($user, $vatPeriod, $collected, $declared, $chainStart, $fiscDebits, $today, $currency);
        $urssaf = $urssafPeriod === null ? null : $this->urssaf($settings, $urssafPeriod, $collected, $fiscDebits, $today, $currency);
        $cfe = $this->cfe($settings, $fiscDebits, $today, $currency);
        $subscriptions = $this->subscriptions($user, $today, $currency);
        $buffer = $settings->treasury_buffer_cents;

        $total = new Money(0, $currency);

        foreach ([$vat?->amount->toMoney(), $urssaf?->amount->toMoney(), $cfe?->amount->toMoney(), $subscriptions?->amount->toMoney(), $buffer] as $component) {
            if ($component !== null) {
                $total = $total->add($component);
            }
        }

        return new BankProvisionsData(
            vat: $vat,
            urssaf: $urssaf,
            cfe: $cfe,
            subscriptions: $subscriptions,
            buffer: $buffer === null ? null : MoneyData::fromMoney($buffer),
            total: MoneyData::fromMoney($total),
        );
    }

    /**
     * @return ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}
     */
    private function vatPeriod(UserSettings $settings, CarbonImmutable $today): ?array
    {
        if (! $settings->vat_regime->isLiable()) {
            return null;
        }

        $annual = $settings->vat_regime === VatRegime::ReelSimplifie;
        $start = $annual ? $today->startOfYear() : $today->startOfMonth();

        return [
            'start' => $start,
            'end' => $annual ? $today->endOfYear() : $today->endOfMonth(),
            'previousStart' => $annual ? $start->subYear() : $start->subMonth(),
        ];
    }

    /**
     * @return ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}
     */
    private function urssafPeriod(UserSettings $settings, CarbonImmutable $today): ?array
    {
        if (! $settings->hasFrenchFiscality()) {
            return null;
        }

        $quarterly = $settings->urssaf_periodicity === UrssafPeriodicity::Quarterly;
        $start = $quarterly ? $today->firstOfQuarter() : $today->startOfMonth();

        return [
            'start' => $start,
            'end' => $quarterly ? $today->lastOfQuarter() : $today->endOfMonth(),
            'previousStart' => $quarterly ? $start->subMonths(3) : $start->subMonth(),
        ];
    }

    /**
     * One query over the widest window any component looks at — back to the
     * CA3 chain's start under réel normal; the per-period sums are bucketed
     * from this set in PHP.
     *
     * @param  ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $vatPeriod
     * @param  ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $urssafPeriod
     */
    private function collectedInvoices(
        User $user,
        CarbonImmutable $today,
        ?array $vatPeriod,
        ?array $urssafPeriod,
        ?CarbonImmutable $chainStart,
    ): CollectedInvoices {
        $starts = array_filter([$vatPeriod['previousStart'] ?? null, $urssafPeriod['previousStart'] ?? null, $chainStart]);

        if ($starts === []) {
            return CollectedInvoices::none();
        }

        return CollectedInvoices::paidBetween($user, min($starts), $today);
    }

    /**
     * The debit movements the nettings below read, fetched once over the
     * widest window any component looks at — never the whole history. The
     * label matching stays in PHP: DetectFiscPayments owns those patterns.
     *
     * @param  ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $vatPeriod
     * @param  ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $urssafPeriod
     * @return Collection<int, BankMovement>
     */
    private function fiscDebits(
        User $user,
        UserSettings $settings,
        ?array $vatPeriod,
        ?array $urssafPeriod,
        CarbonImmutable $today,
    ): Collection {
        $starts = array_filter([
            $vatPeriod['start'] ?? null,
            $urssafPeriod['start'] ?? null,
            // The CFE netting reads the elapsed year.
            $settings->hasFrenchFiscality() ? $today->startOfYear() : null,
        ]);

        if ($starts === []) {
            return new Collection;
        }

        return $user->bankMovements()
            ->where('amount_cents', '<', 0)
            ->whereBetween('booked_on', [min($starts)->toDateString(), $today->toDateString()])
            ->get(['id', 'booked_on', 'label', 'currency', 'amount_cents'])
            ->toBase();
    }

    /**
     * Under réel normal the two periods are two returns of the chain: the
     * previous month's case 32, and the running month's so far — which the
     * chain already nets against a credit the previous month built. Under
     * réel simplifié the CA12 is read the plain way: the year's collected
     * TVA less what its receipted purchases deduct. A foreign account keeps
     * its collected TVA whole — its journal tracks no deduction.
     *
     * @param  array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $period
     * @param  ?DeclaredCa3Months  $declared  null outside French fiscality
     * @param  ?CarbonImmutable  $chainStart  null unless the account files the monthly CA3
     * @param  Collection<int, BankMovement>  $fiscDebits
     */
    private function vat(
        User $user,
        array $period,
        CollectedInvoices $collected,
        ?DeclaredCa3Months $declared,
        ?CarbonImmutable $chainStart,
        Collection $fiscDebits,
        CarbonImmutable $today,
        string $currency,
    ): BankProvisionData {
        $expenses = $declared instanceof DeclaredCa3Months
            ? DeductibleExpenses::spentOrClaimedBetween($user, $chainStart ?? $period['previousStart'], $today, $declared)
            : null;

        if ($chainStart instanceof CarbonImmutable && $expenses instanceof DeductibleExpenses) {
            $chain = new Ca3Chain($collected, $expenses, $chainStart);
            $running = $chain->boxes($period['start']);
            $current = $running->due;
            $previous = $chain->boxes($period['previousStart'])->due;
            $deductible = $running->goodsAndServices + $running->otherDeductible;
        } else {
            $deductible = $expenses?->receiptedRecoverableCents($period['start'], $today) ?? 0;
            $current = max(0, $collected->vatCents($period['start'], $today) - $deductible);
            $previous = max(
                0,
                $collected->vatCents($period['previousStart'], $period['start']->subDay())
                    - ($expenses?->receiptedRecoverableCents($period['previousStart'], $period['start']->subDay()) ?? 0),
            );
        }

        $carried = max(0, $previous - DetectFiscPayments::debitedBetween($fiscDebits, $period['start'], $today, DetectFiscPayments::isVat(...)));

        return new BankProvisionData(
            amount: MoneyData::fromMoney(new Money($current + $carried, $currency)),
            carried: MoneyData::fromMoney(new Money($carried, $currency)),
            rateBp: null,
            deductible: $expenses instanceof DeductibleExpenses ? MoneyData::fromMoney(new Money($deductible, $currency)) : null,
            periodEnd: $period['end'],
        );
    }

    /**
     * @param  array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $period
     * @param  Collection<int, BankMovement>  $fiscDebits
     */
    private function urssaf(
        UserSettings $settings,
        array $period,
        CollectedInvoices $collected,
        Collection $fiscDebits,
        CarbonImmutable $today,
        string $currency,
    ): BankProvisionData {
        // The period that closed was earned under whatever rate applied then — an
        // ACRE step that ended in January does not reprice December. The rate
        // history answers for the closed period; the running one is today's,
        // settled line by line the way the URSSAF does.
        $previousEnd = $period['start']->subDay();
        $carriedRateBp = $this->contributionRateHistory->onDate($settings, $previousEnd);

        $current = $this->urssafOwedCents($settings, $collected, $period['start'], $today, $currency);
        $carried = max(
            0,
            (int) Rate::of(new Money($collected->htCents($period['previousStart'], $previousEnd), $currency), $carriedRateBp)->getAmount()
                - DetectFiscPayments::debitedBetween($fiscDebits, $period['start'], $today, DetectFiscPayments::isUrssaf(...)),
        );

        return new BankProvisionData(
            amount: MoneyData::fromMoney(new Money($current + $carried, $currency)),
            carried: MoneyData::fromMoney(new Money($carried, $currency)),
            rateBp: $settings->effectiveContributionRateBp(),
            deductible: null,
            periodEnd: $period['end'],
        );
    }

    /**
     * An annual subscription the user chose to spread: a twelfth of its debit
     * per month elapsed since the last one, so the year's debit finds the
     * money set aside — eleven twelfths at most, the debit itself lands as
     * an expense.
     */
    private function subscriptions(User $user, CarbonImmutable $today, string $currency): ?BankProvisionData
    {
        $provisioned = $user->subscriptions()
            ->where('provision_monthly', true)
            ->where('is_paused', false)
            ->with('amounts')
            ->get();
        $total = new Money(0, $currency);
        $nextDebit = null;

        foreach ($provisioned as $subscription) {
            $debitOn = new OccurrenceSchedule($subscription)->nextDebitOn($today);

            if (! $debitOn instanceof CarbonImmutable) {
                continue;
            }

            // The debit's own month lands as an expense: eleven twelfths at most.
            $monthsSinceLastDebit = min(11, (int) $debitOn->subYear()->startOfMonth()->diffInMonths($today->startOfMonth()));
            $twelfth = $subscription->monthlyProvisionOn($today);
            assert($twelfth instanceof Money);

            $total = $total->add($twelfth->multiply($monthsSinceLastDebit));
            $nextDebit = min($nextDebit ?? $debitOn, $debitOn);
        }

        if (! $nextDebit instanceof CarbonImmutable) {
            return null;
        }

        return new BankProvisionData(
            amount: MoneyData::fromMoney($total),
            carried: MoneyData::fromMoney(new Money(0, $currency)),
            rateBp: null,
            deductible: null,
            periodEnd: $nextDebit,
        );
    }

    private function urssafOwedCents(
        UserSettings $settings,
        CollectedInvoices $collected,
        CarbonImmutable $from,
        CarbonImmutable $to,
        string $currency,
    ): int {
        return (int) $settings->urssafContributionsOn(new Money($collected->htCents($from, $to), $currency))->getAmount();
    }

    /**
     * The commune sets the CFE, so what to expect is resolved from the best
     * source available — entered amount, last year's detected payment, or the
     * statutory barème — and nothing at all in an exempt year; see CfeSchedule,
     * which the Échéances calendar reads too. The last two sources carry
     * isEstimate onto the provision so the guess is labelled where it lands.
     *
     * Built a twelfth a month rather than locked whole in January: the bill only
     * lands on 15 December, and until then the account owes the elapsed share.
     *
     * @param  Collection<int, BankMovement>  $fiscDebits
     */
    private function cfe(
        UserSettings $settings,
        Collection $fiscDebits,
        CarbonImmutable $today,
        string $currency,
    ): ?BankProvisionData {
        if (! $settings->hasFrenchFiscality()) {
            return null;
        }

        // The entered amount, or last year's payment standing in for it — the
        // same resolution the Échéances screen shows, so the two never disagree.
        $expectedCfe = $this->resolveExpectedCfe->handle($settings);

        if (! $expectedCfe instanceof ExpectedCfe) {
            return null;
        }

        $expected = $expectedCfe->amount;

        if (CfeSchedule::isExemptYear($settings, $today->year)) {
            return null;
        }

        $accrued = $expected->multiply($today->month)->divide(12, MoneyPhp::ROUND_HALF_UP);
        $paid = DetectFiscPayments::debitedBetween($fiscDebits, $today->startOfYear(), $today, DetectFiscPayments::isCfe(...));
        $owed = (int) $accrued->getAmount() - $paid;

        return new BankProvisionData(
            amount: MoneyData::fromMoney(new Money(max(0, $owed), $currency)),
            carried: MoneyData::fromMoney(new Money(0, $currency)),
            rateBp: null,
            deductible: null,
            periodEnd: $today->endOfYear(),
            isEstimate: $expectedCfe->isEstimate,
        );
    }
}
