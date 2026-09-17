<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankProvisionData;
use App\Domain\Bank\Data\BankProvisionsData;
use App\Domain\Bank\Data\CarriedPeriodData;
use App\Domain\Bank\Data\PaidPeriodData;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Deadlines\Actions\ResolveExpectedCfe;
use App\Domain\Deadlines\Calendar\CfeSchedule;
use App\Domain\Deadlines\Calendar\ExpectedCfe;
use App\Domain\Deadlines\Calendar\FiscalDeadline;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
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
use App\Domain\Settings\Rates\ContributionRateTimeline;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Fiscality\MicroBnc;
use App\Domain\Shared\Money\Rate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;
use LogicException;

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
 * - plus every closed period of the past year still owed, carried until its
 *   return is marked paid on the Déclarations screen or the matching payment
 *   shows up in the imported movements — France pays in arrears, so the
 *   URSSAF prélèvements or TVA télérèglements detected since the oldest of
 *   them closed settle the carried debt oldest first, clamped at zero. A
 *   carry is priced at the rate that applied when its period closed, not
 *   today's: an ACRE step ending in January must not reprice the December
 *   that is still owed;
 * - plus a twelfth of the expected CFE per elapsed month, netted the same way
 *   against detected CFE debits;
 * - plus, without the versement libératoire, the income tax the micro-BNC
 *   profit will cost: the running year's so far, and last year's whole until
 *   its 2042-C PRO is marked paid;
 * - plus, for each annual subscription the user chose to spread, a twelfth of
 *   its debit per month elapsed since the last one;
 * - plus the matelas as configured, verbatim.
 */
class ComputeBankProvisions
{
    /**
     * How far back a closed period stays carried when nothing settles it: a
     * return older than this is the fisc's problem to chase, not the treasury's.
     */
    public const int CARRY_LOOKBACK_MONTHS = 12;

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
        $lookbackStart = self::lookbackStart($today);
        $declared = $vatPeriod !== null && $settings->hasFrenchFiscality() ? DeclaredCa3Months::of($user->id) : null;
        $chainStart = $declared instanceof DeclaredCa3Months && $settings->filesMonthlyCa3()
            ? Ca3ChainStart::resolve($user, $settings, $declared, $vatPeriod['previousStart'])
            : null;
        $collected = $this->collectedInvoices($user, $today, $lookbackStart, $vatPeriod, $urssafPeriod, $chainStart, $this->owesIncomeTax($settings));
        $fiscDebits = $this->fiscDebits($user, $settings, $lookbackStart, $vatPeriod, $urssafPeriod, $today);
        $paid = $settings->hasFrenchFiscality() ? $this->paidPeriods($user) : [];
        $rates = $settings->hasFrenchFiscality() ? $this->contributionRateHistory->timeline($settings) : null;

        $vat = $vatPeriod === null
            ? null
            : $this->vat($user, $vatPeriod, $lookbackStart, $collected, $declared, $chainStart, $paid, $fiscDebits, $today, $currency);
        $urssaf = $urssafPeriod === null || ! $rates instanceof ContributionRateTimeline
            ? null
            : $this->urssaf($settings, $rates, $urssafPeriod, $lookbackStart, $collected, $paid, $fiscDebits, $today, $currency);
        $cfe = $this->cfe($settings, $paid, $fiscDebits, $today, $currency);
        $incomeTax = $rates instanceof ContributionRateTimeline && $this->owesIncomeTax($settings)
            ? $this->incomeTax($settings, $rates, $collected, $paid, $today, $currency)
            : null;
        $subscriptions = $this->subscriptions($user, $today, $currency);
        $buffer = $settings->treasury_buffer_cents;

        $total = new Money(0, $currency);

        foreach ([$vat?->amount->toMoney(), $urssaf?->amount->toMoney(), $cfe?->amount->toMoney(), $incomeTax?->amount->toMoney(), $subscriptions?->amount->toMoney(), $buffer] as $component) {
            if ($component !== null) {
                $total = $total->add($component);
            }
        }

        return new BankProvisionsData(
            vat: $vat,
            urssaf: $urssaf,
            cfe: $cfe,
            incomeTax: $incomeTax,
            subscriptions: $subscriptions,
            buffer: $buffer === null ? null : MoneyData::fromMoney($buffer),
            total: MoneyData::fromMoney($total),
        );
    }

    /**
     * @return ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable, annual: bool}
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
            'annual' => $annual,
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
     * One query over the widest window any component looks at — the carry's
     * year back, or the CA3 chain's start under réel normal when that is
     * older; the per-period sums are bucketed from this set in PHP.
     *
     * @param  ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $vatPeriod
     * @param  ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $urssafPeriod
     */
    private function collectedInvoices(
        User $user,
        CarbonImmutable $today,
        CarbonImmutable $lookbackStart,
        ?array $vatPeriod,
        ?array $urssafPeriod,
        ?CarbonImmutable $chainStart,
        bool $owesIncomeTax,
    ): CollectedInvoices {
        // One period before the carry window too: it absorbs the payment that lands first.
        $starts = array_filter([
            $vatPeriod === null ? null : min($vatPeriod['previousStart'], $lookbackStart->subMonth()),
            $urssafPeriod === null ? null : $lookbackStart->subMonths(6),
            $chainStart,
            // The income tax carries last year whole, from its first January.
            $owesIncomeTax ? $today->startOfYear()->subYear() : null,
        ]);

        if ($starts === []) {
            return CollectedInvoices::none();
        }

        return CollectedInvoices::paidBetween($user, min($starts), $today);
    }

    /**
     * The debit movements the nettings below read, fetched once over the
     * widest window any component looks at — never the whole history. The
     * label matching stays in PHP: DetectFiscPayments owns those patterns.
     * Only the fisc's own debits become models: every carried period rescans
     * this set, and a year of card payments would otherwise be hydrated and
     * read each time.
     *
     * @param  ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $vatPeriod
     * @param  ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $urssafPeriod
     * @return Collection<int, BankMovement>
     */
    private function fiscDebits(
        User $user,
        UserSettings $settings,
        CarbonImmutable $lookbackStart,
        ?array $vatPeriod,
        ?array $urssafPeriod,
        CarbonImmutable $today,
    ): Collection {
        $starts = array_filter([
            // The carries net the payments made since the period before the window closed.
            $vatPeriod === null && $urssafPeriod === null ? null : $lookbackStart->subMonths(6),
            // The CFE netting reads the elapsed year.
            $settings->hasFrenchFiscality() ? $today->startOfYear() : null,
        ]);

        if ($starts === []) {
            return new Collection;
        }

        /** @var Collection<int, object{id: int, booked_on: string, label: string, currency: string, amount_cents: int|numeric-string}> $debits */
        $debits = $user->bankMovements()
            ->toBase()
            ->where('amount_cents', '<', 0)
            ->whereBetween('booked_on', [min($starts)->toDateString(), $today->toDateString()])
            ->get(['id', 'booked_on', 'label', 'currency', 'amount_cents']);

        return BankMovement::hydrate($debits->filter(fn (object $debit): bool => DetectFiscPayments::isFisc($debit->label))->all())->toBase();
    }

    /**
     * Under réel normal every period is a return of the chain: the running
     * month's case 32 so far — which the chain already nets against a credit
     * the previous month built — plus each closed month of the past year
     * still owed. Under réel simplifié the CA12 is read the plain way: the
     * year's collected TVA less what its receipted purchases deduct, last
     * year's carried until paid. A foreign account keeps its collected TVA
     * whole — its journal tracks no deduction — and carries only the
     * previous period, as it files no return here to mark.
     *
     * @param  array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable, annual: bool}  $period
     * @param  ?DeclaredCa3Months  $declared  null outside French fiscality
     * @param  ?CarbonImmutable  $chainStart  null unless the account files the monthly CA3
     * @param  array<string, CarbonImmutable>  $paid
     * @param  Collection<int, BankMovement>  $fiscDebits
     */
    private function vat(
        User $user,
        array $period,
        CarbonImmutable $lookbackStart,
        CollectedInvoices $collected,
        ?DeclaredCa3Months $declared,
        ?CarbonImmutable $chainStart,
        array $paid,
        Collection $fiscDebits,
        CarbonImmutable $today,
        string $currency,
    ): BankProvisionData {
        $expenses = $declared instanceof DeclaredCa3Months
            ? DeductibleExpenses::spentOrClaimedBetween($user, min($chainStart ?? $period['previousStart'], $lookbackStart), $today, $declared)
            : null;

        if ($chainStart instanceof CarbonImmutable && $expenses instanceof DeductibleExpenses) {
            $chain = new Ca3Chain($collected, $expenses, $chainStart);
            $running = $chain->boxes($period['start']);
            $current = $running->due;
            $deductible = $running->goodsAndServices + $running->otherDeductible;
            $closed = [];

            for ($month = max($chainStart, $lookbackStart->subMonth()); $month->lessThanOrEqualTo($period['previousStart']); $month = $month->addMonth()) {
                $closed[] = ['key' => FiscalDeadline::monthKey($month), 'end' => $month->endOfMonth(), 'due' => $chain->boxes($month)->due];
            }

            $carry = $this->carry($closed, FiscalDeadlineKind::VatCa3, $paid, $lookbackStart, $fiscDebits, DetectFiscPayments::isVat(...), $today, $currency);
        } else {
            $previousEnd = $period['start']->subDay();
            $deductible = $expenses?->receiptedRecoverableCents($period['start'], $today) ?? 0;
            $current = max(0, $collected->vatCents($period['start'], $today) - $deductible);
            $previous = max(
                0,
                $collected->vatCents($period['previousStart'], $previousEnd)
                    - ($expenses?->receiptedRecoverableCents($period['previousStart'], $previousEnd) ?? 0),
            );
            $annual = $period['annual'];
            $carry = $this->carry(
                [['key' => $annual ? (string) $period['previousStart']->year : FiscalDeadline::monthKey($period['previousStart']), 'end' => $previousEnd, 'due' => $previous]],
                $annual ? FiscalDeadlineKind::VatCa12 : FiscalDeadlineKind::VatCa3,
                $paid,
                $period['previousStart'],
                $fiscDebits,
                DetectFiscPayments::isVat(...),
                $today,
                $currency,
            );
        }

        return new BankProvisionData(
            amount: MoneyData::fromMoney(new Money($current + $carry['total'], $currency)),
            carried: MoneyData::fromMoney(new Money($carry['total'], $currency)),
            rateBp: null,
            deductible: $expenses instanceof DeductibleExpenses ? MoneyData::fromMoney(new Money($deductible, $currency)) : null,
            periodEnd: $period['end'],
            carriedPeriods: $carry['periods'],
            paidPeriods: $carry['paid'],
        );
    }

    /**
     * The closed periods still owed, oldest first. A payment detected on the
     * compte pro answers for the period that closed just before it: the
     * debits booked between a period's close and the next one's settle that
     * period, and what they leave over reaches back to an older period still
     * owed — never forward, since a return is paid after its period closes.
     * A period marked paid, or one that closed before the carry window,
     * still takes its due out of its own debits, so its prélèvement is not
     * read as someone else's. Only the carried periods are listed; a period
     * a payment covered stays at zero, so the Déclarations screen can say it
     * is settled. A period marked paid that no debit has settled yet is listed
     * apart, at what it would still carry: it left the provisions, not yet the
     * balance.
     *
     * @param  list<array{key: string, end: CarbonImmutable, due: int}>  $closed  oldest first, contiguous, starting one period before the window
     * @param  array<string, CarbonImmutable>  $paid
     * @param  Collection<int, BankMovement>  $fiscDebits
     * @return array{periods: list<CarriedPeriodData>, total: int, paid: list<PaidPeriodData>}
     */
    private function carry(
        array $closed,
        FiscalDeadlineKind $kind,
        array $paid,
        CarbonImmutable $windowStart,
        Collection $fiscDebits,
        callable $matchesLabel,
        CarbonImmutable $today,
        string $currency,
    ): array {
        $remaining = array_column($closed, 'due');
        $leftover = [];

        foreach ($closed as $index => $period) {
            $paidWindowEnd = isset($closed[$index + 1]) ? min($closed[$index + 1]['end'], $today) : $today;
            $debited = DetectFiscPayments::debitedBetween($fiscDebits, $period['end']->addDay(), $paidWindowEnd, $matchesLabel);
            $applied = min($debited, $remaining[$index]);
            $remaining[$index] -= $applied;
            $leftover[$index] = $debited - $applied;
        }

        foreach ($closed as $index => $period) {
            for ($later = $index + 1; $later < count($closed) && $remaining[$index] > 0; $later++) {
                $applied = min($leftover[$later], $remaining[$index]);
                $remaining[$index] -= $applied;
                $leftover[$later] -= $applied;
            }
        }

        $periods = [];
        $paidPeriods = [];
        $total = 0;

        foreach ($closed as $index => $period) {
            if ($period['due'] <= 0 || $period['end']->lessThan($windowStart)) {
                continue;
            }

            $paidOn = $paid["{$kind->value}:{$period['key']}"] ?? null;

            if ($paidOn instanceof CarbonImmutable) {
                if ($remaining[$index] > 0) {
                    $paidPeriods[] = new PaidPeriodData($period['key'], MoneyData::fromMoney(new Money($remaining[$index], $currency)), $paidOn);
                }

                continue;
            }

            $periods[] = new CarriedPeriodData($period['key'], MoneyData::fromMoney(new Money($remaining[$index], $currency)));
            $total += $remaining[$index];
        }

        return ['periods' => $periods, 'total' => $total, 'paid' => $paidPeriods];
    }

    /**
     * The returns marked paid on the Déclarations screen, keyed `kind:period`,
     * with the day each was marked.
     *
     * @return array<string, CarbonImmutable>
     */
    private function paidPeriods(User $user): array
    {
        $paid = [];

        foreach (FiscalDeadlineCompletion::query()->where('user_id', $user->id)->whereNotNull('paid_on')->get(['kind', 'period_key', 'paid_on']) as $completion) {
            assert($completion->paid_on instanceof CarbonImmutable);
            $paid[$completion->key()] = $completion->paid_on;
        }

        return $paid;
    }

    /** The first day a closed period is still carried from. */
    public static function lookbackStart(CarbonImmutable $today): CarbonImmutable
    {
        return $today->startOfMonth()->subMonths(self::CARRY_LOOKBACK_MONTHS);
    }

    /**
     * A carried period is priced with one rate on its whole HT, while the
     * running period sums the URSSAF lines each rounded on its own, so a carry
     * can sit a cent off what the URSSAF debits for it. ContributionRate
     * records only the combined effective rate, not the cotisations, CFP and
     * versement libératoire it was made of, so a closed period's lines cannot
     * be rebuilt.
     *
     * @param  array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $period
     * @param  array<string, CarbonImmutable>  $paid
     * @param  Collection<int, BankMovement>  $fiscDebits
     */
    private function urssaf(
        UserSettings $settings,
        ContributionRateTimeline $rates,
        array $period,
        CarbonImmutable $lookbackStart,
        CollectedInvoices $collected,
        array $paid,
        Collection $fiscDebits,
        CarbonImmutable $today,
        string $currency,
    ): BankProvisionData {
        // A period that closed was earned under whatever rate applied then — an
        // ACRE step that ended in January does not reprice December. The rate
        // history answers for the closed periods; the running one is today's,
        // settled line by line the way the URSSAF does.
        $quarterly = $settings->urssaf_periodicity === UrssafPeriodicity::Quarterly;
        $closed = [];

        // Back through every period that ends inside the window, then one
        // more: the period before it absorbs the payment that lands first.
        $start = $period['previousStart'];

        do {
            $end = $quarterly ? $start->lastOfQuarter() : $start->endOfMonth();
            $closed[] = [
                'key' => $quarterly ? FiscalDeadline::quarterKey($start) : FiscalDeadline::monthKey($start),
                'end' => $end,
                'due' => (int) Rate::of(new Money($collected->htCents($start, $end), $currency), $rates->onDate($end))->getAmount(),
            ];
            $start = $quarterly ? $start->subMonths(3) : $start->subMonth();
        } while ($end->greaterThanOrEqualTo($lookbackStart));

        $carry = $this->carry(array_reverse($closed), FiscalDeadlineKind::UrssafDeclaration, $paid, $lookbackStart, $fiscDebits, DetectFiscPayments::isUrssaf(...), $today, $currency);
        $current = $this->urssafOwedCents($settings, $collected, $period['start'], $today, $currency);

        return new BankProvisionData(
            amount: MoneyData::fromMoney(new Money($current + $carry['total'], $currency)),
            carried: MoneyData::fromMoney(new Money($carry['total'], $currency)),
            rateBp: $settings->effectiveContributionRateBp(),
            deductible: null,
            periodEnd: $period['end'],
            carriedPeriods: $carry['periods'],
            paidPeriods: $carry['paid'],
        );
    }

    /**
     * Without the versement libératoire, the micro-BNC profit joins the
     * household's income tax, paid the year after it was earned. There is no
     * household to run the barème on, so the figure is the avis's own
     * prélèvement à la source rate on the receipts less the 34 % abatement: the
     * running year's receipts so far, plus last year's whole bill until its
     * 2042-C PRO is marked paid on Déclarations — then it moves to the paid
     * side until the balance can show it. A month the option was in force on
     * adds nothing: its tax left with the URSSAF.
     *
     * No detected debit settles it, unlike the returns above: the fisc takes
     * income tax from whichever account the household gave it, which is
     * rarely the compte pro.
     *
     * @param  array<string, CarbonImmutable>  $paid
     */
    private function incomeTax(
        UserSettings $settings,
        ContributionRateTimeline $rates,
        CollectedInvoices $collected,
        array $paid,
        CarbonImmutable $today,
        string $currency,
    ): BankProvisionData {
        $rateBp = $settings->income_tax_rate_bp ?? throw new LogicException('An account with no withholding rate owes no income tax provision.');
        $lastYearStart = $today->startOfYear()->subYear();
        $lastYearKey = (string) $lastYearStart->year;
        $running = $this->incomeTaxCents($rates, $collected, $today->startOfYear(), $today, $rateBp, $currency);
        $lastYear = $this->incomeTaxCents($rates, $collected, $lastYearStart, $lastYearStart->endOfYear(), $rateBp, $currency);
        $paidOn = $paid[FiscalDeadlineKind::IncomeTaxReturn->value.':'.$lastYearKey] ?? null;
        $carried = $paidOn instanceof CarbonImmutable ? 0 : $lastYear;

        return new BankProvisionData(
            amount: MoneyData::fromMoney(new Money($running + $carried, $currency)),
            carried: MoneyData::fromMoney(new Money($carried, $currency)),
            rateBp: $rateBp,
            deductible: null,
            periodEnd: $today->endOfYear(),
            carriedPeriods: $carried > 0 ? [new CarriedPeriodData($lastYearKey, MoneyData::fromMoney(new Money($carried, $currency)))] : [],
            paidPeriods: $paidOn instanceof CarbonImmutable && $lastYear > 0
                ? [new PaidPeriodData($lastYearKey, MoneyData::fromMoney(new Money($lastYear, $currency)), $paidOn)]
                : [],
        );
    }

    /** The income tax on the receipts collected over [$from, $to] outside the versement libératoire. */
    private function incomeTaxCents(
        ContributionRateTimeline $rates,
        CollectedInvoices $collected,
        CarbonImmutable $from,
        CarbonImmutable $to,
        int $rateBp,
        string $currency,
    ): int {
        $receiptsCents = 0;

        for ($month = $from->startOfMonth(); $month->lessThanOrEqualTo($to); $month = $month->addMonth()) {
            $monthEnd = min($month->endOfMonth(), $to);

            // Nothing recorded means the settings answer, and the settings say the option is off.
            if ($rates->liberatingPaymentOn($monthEnd)?->isPaid !== true) {
                $receiptsCents += $collected->htCents($month, $monthEnd);
            }
        }

        $receipts = new Money($receiptsCents, $currency);
        $taxable = Money::max(new Money(0, $currency), $receipts->subtract(MicroBnc::abatementOf($receipts)));

        return (int) Rate::of($taxable, $rateBp)->getAmount();
    }

    /** Whether the account owes the income tax the provision prices: French, off the option, with a rate to price it at. */
    private function owesIncomeTax(UserSettings $settings): bool
    {
        return $settings->hasFrenchFiscality()
            && ! $settings->liberating_payment
            && $settings->income_tax_rate_bp !== null;
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
            // A subscription not yet debited once counts from its start, not
            // from a debit a year before it existed.
            $lastDebit = max($debitOn->subYear(), $subscription->started_on);
            $monthsSinceLastDebit = min(11, (int) $lastDebit->startOfMonth()->diffInMonths($today->startOfMonth()));
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
     * @param  array<string, CarbonImmutable>  $paid
     * @param  Collection<int, BankMovement>  $fiscDebits
     */
    private function cfe(
        UserSettings $settings,
        array $paid,
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

        $accrued = CfeSchedule::accruedBy($expected, $today->month);
        $debited = DetectFiscPayments::debitedBetween($fiscDebits, $today->startOfYear(), $today, DetectFiscPayments::isCfe(...));
        $owed = max(0, (int) $accrued->getAmount() - $debited);
        // A CFE marked paid on Déclarations was settled: nothing is left to
        // hold back, and what was being held moves to the paid side until its
        // debit shows up.
        $paidOn = $paid[FiscalDeadlineKind::Cfe->value.':'.$today->year] ?? null;

        return new BankProvisionData(
            amount: MoneyData::fromMoney(new Money($paidOn instanceof CarbonImmutable ? 0 : $owed, $currency)),
            carried: MoneyData::fromMoney(new Money(0, $currency)),
            rateBp: null,
            deductible: null,
            periodEnd: $today->endOfYear(),
            isEstimate: $expectedCfe->isEstimate,
            paidPeriods: $paidOn instanceof CarbonImmutable && $owed > 0
                ? [new PaidPeriodData((string) $today->year, MoneyData::fromMoney(new Money($owed, $currency)), $paidOn)]
                : [],
        );
    }
}
