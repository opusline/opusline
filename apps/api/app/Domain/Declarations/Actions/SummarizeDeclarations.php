<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Actions;

use App\Domain\Bank\Actions\DetectFiscPayments;
use App\Domain\Bank\Actions\SummarizeTreasury;
use App\Domain\Bank\Data\BankBalanceData;
use App\Domain\Bank\Data\BankProvisionData;
use App\Domain\Bank\Data\TreasuryData;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Deadlines\Actions\GenerateFiscalDeadlines;
use App\Domain\Deadlines\Calendar\FiscalDeadline;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Declarations\Data\Ca3BoxesData;
use App\Domain\Declarations\Data\ContributionLineData;
use App\Domain\Declarations\Data\DeclarationCompletionData;
use App\Domain\Declarations\Data\DeclarationDeadlineData;
use App\Domain\Declarations\Data\DeclarationHistoryRowData;
use App\Domain\Declarations\Data\DeclarationHistoryUrssafData;
use App\Domain\Declarations\Data\DeclarationHistoryVatData;
use App\Domain\Declarations\Data\DeclarationsData;
use App\Domain\Declarations\Data\DeclarationSettlementData;
use App\Domain\Declarations\Data\RevenueCeilingData;
use App\Domain\Declarations\Data\SummarizeDeclarationsData;
use App\Domain\Declarations\Data\UrssafDeclarationData;
use App\Domain\Declarations\Data\VatDeclarationData;
use App\Domain\Declarations\Vat\Ca3Chain;
use App\Domain\Declarations\Vat\Ca3ChainStart;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Expenses\Vat\DeductibleExpenses;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Shared\Fiscality\MicroBnc;
use App\Domain\Shared\Money\Rate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Closure;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * The figures a French freelancer retypes into the fisc's forms for one
 * month — by default the most recently closed one, otherwise the month asked
 * for, never the running one. Both blocks are cash basis: URSSAF and TVA
 * declare what was collected, not what was invoiced.
 *
 * A period with no collections still returns its zeros: a zero month must be
 * declared to URSSAF too, so an empty screen would be the wrong kind of quiet.
 *
 * @phpstan-type Period array{start: CarbonImmutable, end: CarbonImmutable, key: string}
 */
class SummarizeDeclarations
{
    private const int HISTORY_MONTHS = 6;

    public function __construct(
        private readonly GenerateFiscalDeadlines $generateFiscalDeadlines,
        private readonly SummarizeTreasury $summarizeTreasury,
    ) {}

    /**
     * @throws ValidationException for the running month or a later one
     */
    public function handle(User $user, SummarizeDeclarationsData $data): DeclarationsData
    {
        $settings = $user->settingsOrFail();
        $today = $settings->today();
        $currentMonth = $today->startOfMonth();
        $monthStart = $data->period === null
            ? $currentMonth->subMonth()
            : CarbonImmutable::parse($data->period.'-01');
        $monthEnd = $monthStart->endOfMonth();

        if ($monthStart->greaterThanOrEqualTo($currentMonth)) {
            throw ValidationException::withMessages(['period' => __('declarations.future_period')]);
        }

        $urssaf = $vat = $cumulative = null;
        $history = [];

        if ($settings->hasFrenchFiscality()) {
            $completions = $user->fiscalDeadlineCompletions()->get();
            $declared = DeclaredCa3Months::fromCompletions($completions);
            $historyStart = $monthStart->subMonths(self::HISTORY_MONTHS - 1);
            $urssafPeriod = $this->urssafPeriod($settings, $monthStart, $currentMonth);
            $earliestUrssafPeriod = $this->urssafPeriod($settings, $historyStart, $currentMonth);
            $chainStart = $settings->filesMonthlyCa3() ? Ca3ChainStart::resolve($user, $settings, $declared, $monthStart) : null;
            $collected = CollectedInvoices::paidBetween(
                $user,
                min($earliestUrssafPeriod['start'], $monthStart->startOfYear(), $chainStart ?? $historyStart, $historyStart),
                max($urssafPeriod['end'], $monthEnd),
            );
            $deadlines = $this->generateFiscalDeadlines->handle(
                $settings,
                min($monthStart, $urssafPeriod['start']),
                max($monthEnd, $urssafPeriod['end'])->addMonths(2)->endOfMonth(),
            );
            $chain = $chainStart instanceof CarbonImmutable
                ? new Ca3Chain(
                    $collected,
                    DeductibleExpenses::spentOrClaimedBetween($user, min($chainStart, $historyStart), $monthEnd, $declared),
                    $chainStart,
                )
                : null;
            $fiscDebits = $this->fiscDebitsAfter($user, $settings, $urssafPeriod['end'], $monthEnd);

            // The engine holds a provision for the last closed period only:
            // the treasury is read when a shown period is that one, and each
            // block is matched against its own kind's provision, or nothing.
            $carriedMonth = $currentMonth->subMonth();
            $urssafCarried = $urssafPeriod['key'] === $this->urssafPeriod($settings, $carriedMonth, $currentMonth)['key'];
            $vatCarried = $chain instanceof Ca3Chain && $monthStart->equalTo($carriedMonth);
            $treasury = $urssafCarried || $vatCarried ? $this->summarizeTreasury->handle($user) : null;

            $urssaf = $this->urssaf(
                $settings,
                $collected,
                $urssafPeriod,
                $monthStart,
                $deadlines,
                $completions,
                $fiscDebits,
                $urssafCarried ? $this->coveredCarry($treasury, $treasury?->provisions->urssaf) : null,
                $today,
            );
            $vat = $chain instanceof Ca3Chain
                ? $this->vat(
                    $settings,
                    $collected,
                    $chain,
                    $monthStart,
                    $deadlines,
                    $completions,
                    $fiscDebits,
                    $vatCarried ? $this->coveredCarry($treasury, $treasury?->provisions->vat) : null,
                    $today,
                )
                : null;
            $cumulative = $this->cumulative($settings, $collected, $monthStart);
            $history = $this->history($settings, $collected, $chain, $completions, $monthStart, $currentMonth);
        }

        $next = $monthStart->addMonth();

        return new DeclarationsData(
            period: $monthStart->format('Y-m'),
            previousPeriod: $monthStart->subMonth()->format('Y-m'),
            nextPeriod: $next->lessThan($currentMonth) ? $next->format('Y-m') : null,
            isDefault: $data->period === null,
            urssaf: $urssaf,
            vat: $vat,
            cumulative: $cumulative,
            history: $history,
        );
    }

    /**
     * The screen after a tick, in the same transaction as the tick: the
     * screen refuses the running month, and a 422 must mean nothing happened.
     *
     * @throws ValidationException for the running month or a later one
     */
    public function handleAfter(User $user, SummarizeDeclarationsData $data, Closure $write): DeclarationsData
    {
        return DB::transaction(function () use ($user, $data, $write): DeclarationsData {
            $write();

            return $this->handle($user, $data);
        });
    }

    /**
     * The URSSAF period to declare for the shown month: the month itself, or
     * for a quarterly account the quarter holding it — unless that quarter is
     * still running, in which case the one before, the last that can be filed.
     *
     * @return Period
     */
    private function urssafPeriod(UserSettings $settings, CarbonImmutable $monthStart, CarbonImmutable $currentMonth): array
    {
        if ($settings->urssaf_periodicity !== UrssafPeriodicity::Quarterly) {
            return ['start' => $monthStart, 'end' => $monthStart->endOfMonth(), 'key' => FiscalDeadline::monthKey($monthStart)];
        }

        $start = $monthStart->firstOfQuarter();

        if ($start->lastOfQuarter()->greaterThanOrEqualTo($currentMonth)) {
            $start = $start->subQuarter();
        }

        return ['start' => $start, 'end' => $start->lastOfQuarter(), 'key' => FiscalDeadline::quarterKey($start)];
    }

    /**
     * @param  list<FiscalDeadline>  $deadlines
     */
    private function deadline(array $deadlines, FiscalDeadlineKind $kind, string $periodKey, CarbonImmutable $today): ?DeclarationDeadlineData
    {
        foreach ($deadlines as $deadline) {
            if ($deadline->is($kind, $periodKey)) {
                return DeclarationDeadlineData::on($deadline->dueOn, $today);
            }
        }

        return null;
    }

    /**
     * @param  Collection<int, FiscalDeadlineCompletion>  $completions
     */
    private function completion(Collection $completions, FiscalDeadlineKind $kind, string $periodKey): ?DeclarationCompletionData
    {
        $completion = $completions->first(
            fn (FiscalDeadlineCompletion $completion): bool => $completion->kind === $kind && $completion->period_key === $periodKey,
        );

        return DeclarationCompletionData::fromCompletion($completion);
    }

    /**
     * @param  Period  $period
     * @param  list<FiscalDeadline>  $deadlines
     * @param  Collection<int, FiscalDeadlineCompletion>  $completions
     * @param  Collection<int, BankMovement>  $fiscDebits
     * @param  ?Money  $coveredCarry  what the compte pro holds for this period, when the engine carries it
     */
    private function urssaf(
        UserSettings $settings,
        CollectedInvoices $collected,
        array $period,
        CarbonImmutable $monthStart,
        array $deadlines,
        Collection $completions,
        Collection $fiscDebits,
        ?Money $coveredCarry,
        CarbonImmutable $today,
    ): UrssafDeclarationData {
        $base = new Money($collected->htCents($period['start'], $period['end']), $settings->currency->value);
        $total = $settings->urssafContributionsOn($base);
        $completion = $this->completion($completions, FiscalDeadlineKind::UrssafDeclaration, $period['key']);

        return new UrssafDeclarationData(
            period: $period['key'],
            periodicity: $settings->urssaf_periodicity,
            coversShownMonth: $monthStart->betweenIncluded($period['start'], $period['end']),
            base: MoneyData::fromMoney($base),
            invoiceCount: $collected->countBetween($period['start'], $period['end']),
            lines: array_map(ContributionLineData::fromLine(...), $settings->urssafContributionLines($base)),
            total: MoneyData::fromMoney($total),
            deadline: $this->deadline($deadlines, FiscalDeadlineKind::UrssafDeclaration, $period['key'], $today),
            completion: $completion,
            settlement: DeclarationSettlementData::of(
                $total,
                DetectFiscPayments::debitedBetween($fiscDebits, $period['end']->addDay(), $this->nextUrssafPeriodEnd($period['end'], $settings), DetectFiscPayments::isUrssaf(...)),
                $completion?->paidOn instanceof CarbonImmutable ? null : $coveredCarry,
            ),
        );
    }

    /** The end of the URSSAF period after one ending on $periodEnd — the window its payment is debited in. */
    private function nextUrssafPeriodEnd(CarbonImmutable $periodEnd, UserSettings $settings): CarbonImmutable
    {
        return $settings->urssaf_periodicity === UrssafPeriodicity::Quarterly
            ? $periodEnd->addDay()->lastOfQuarter()
            : $periodEnd->addDay()->endOfMonth();
    }

    /**
     * The debits of the periods that follow the shown ones, where their
     * payments land. Loaded once for both blocks; nothing for an account
     * with no compte pro.
     *
     * @return Collection<int, BankMovement>
     */
    private function fiscDebitsAfter(User $user, UserSettings $settings, CarbonImmutable $urssafEnd, CarbonImmutable $monthEnd): Collection
    {
        $from = min($urssafEnd, $monthEnd)->addDay();
        $to = max($this->nextUrssafPeriodEnd($urssafEnd, $settings), $monthEnd->addDay()->endOfMonth());

        return $user->bankMovements()
            ->where('amount_cents', '<', 0)
            ->whereBetween('booked_on', [$from->toDateString(), $to->toDateString()])
            ->get(['id', 'booked_on', 'label', 'currency', 'amount_cents'])
            ->toBase();
    }

    /**
     * What the balance still covers of a kind's carry once pending transfers
     * and the other provisions come off — null without a known balance.
     */
    private function coveredCarry(?TreasuryData $treasury, ?BankProvisionData $provision): ?Money
    {
        if (! $provision instanceof BankProvisionData || ! $treasury?->balance instanceof BankBalanceData) {
            return null;
        }

        $otherProvisions = $treasury->provisions->total->toMoney()->subtract($provision->amount->toMoney());
        $coverable = $treasury->balance->amount->toMoney()
            ->subtract($treasury->pendingTransfers->toMoney())
            ->subtract($otherProvisions);

        return Money::max(new Money(0, $coverable->getCurrency()->getCode()), Money::min($provision->carried->toMoney(), $coverable));
    }

    private function cumulative(UserSettings $settings, CollectedInvoices $collected, CarbonImmutable $monthStart): RevenueCeilingData
    {
        $currency = $settings->currency->value;
        $collectedHt = new Money($collected->htCents($monthStart->startOfYear(), $monthStart->endOfMonth()), $currency);
        $ceiling = new Money(MicroBnc::CEILING_CENTS, $currency);

        return new RevenueCeilingData(
            year: $monthStart->year,
            collectedHt: MoneyData::fromMoney($collectedHt),
            ceiling: MoneyData::fromMoney($ceiling),
            shareBp: Rate::shareBp((int) $collectedHt->getAmount(), MicroBnc::CEILING_CENTS),
            margin: SignedMoneyData::fromMoney($ceiling->subtract($collectedHt)),
        );
    }

    /**
     * @param  list<FiscalDeadline>  $deadlines
     * @param  Collection<int, FiscalDeadlineCompletion>  $completions
     * @param  Collection<int, BankMovement>  $fiscDebits
     * @param  ?Money  $coveredCarry  what the compte pro holds for this month, when the engine carries it
     */
    private function vat(
        UserSettings $settings,
        CollectedInvoices $collected,
        Ca3Chain $chain,
        CarbonImmutable $monthStart,
        array $deadlines,
        Collection $completions,
        Collection $fiscDebits,
        ?Money $coveredCarry,
        CarbonImmutable $today,
    ): VatDeclarationData {
        $month = FiscalDeadline::monthKey($monthStart);
        $monthEnd = $monthStart->endOfMonth();
        $currency = $settings->currency->value;
        $expenses = $chain->expenses;
        $boxes = $chain->boxes($monthStart);
        $completion = $this->completion($completions, FiscalDeadlineKind::VatCa3, $month);

        return new VatDeclarationData(
            period: $month,
            regime: $settings->vat_regime,
            salesHt: MoneyData::fromMoney(new Money($boxes->salesHt, $currency)),
            collected: MoneyData::fromMoney(new Money($collected->vatCents($monthStart, $monthEnd), $currency)),
            rateBp: $collected->uniqueRateBp($monthStart, $monthEnd, $settings->default_vat_rate_bp),
            boxes: Ca3BoxesData::fromBoxes($boxes, $currency),
            invoiceCount: $collected->countBetween($monthStart, $monthEnd),
            expenseCount: $expenses->countSpentIn($month),
            reverseChargedVat: MoneyData::fromMoney(new Money($expenses->reverseChargeVatCents($month), $currency)),
            creditIsRefundable: $boxes->creditIsRefundable(),
            deadline: $this->deadline($deadlines, FiscalDeadlineKind::VatCa3, $month, $today),
            completion: $completion,
            settlement: DeclarationSettlementData::of(
                new Money($boxes->due, $currency),
                DetectFiscPayments::debitedBetween($fiscDebits, $monthEnd->addDay(), $monthEnd->addDay()->endOfMonth(), DetectFiscPayments::isVat(...)),
                $completion?->paidOn instanceof CarbonImmutable ? null : $coveredCarry,
            ),
        );
    }

    /**
     * A month before the chain's anchor is read the way the screen would show
     * it: as a chain of its own, nothing carried in — the anchor rule is about
     * what the fisc holds, and no month before the first return can say.
     *
     * @param  Collection<int, FiscalDeadlineCompletion>  $completions
     * @return list<DeclarationHistoryRowData>
     */
    private function history(
        UserSettings $settings,
        CollectedInvoices $collected,
        ?Ca3Chain $chain,
        Collection $completions,
        CarbonImmutable $monthStart,
        CarbonImmutable $currentMonth,
    ): array {
        $currency = $settings->currency->value;
        $startedOn = $settings->business_started_on;
        $rows = [];

        for ($offset = 0; $offset < self::HISTORY_MONTHS; $offset++) {
            $month = $monthStart->subMonths($offset);
            $period = $this->urssafPeriod($settings, $month, $currentMonth);
            $existed = ! $startedOn instanceof CarbonImmutable || $month->endOfMonth()->greaterThanOrEqualTo($startedOn);
            $urssaf = null;
            $vat = null;

            if ($existed && $month->betweenIncluded($period['start'], $period['end'])) {
                $base = new Money($collected->htCents($period['start'], $period['end']), $currency);
                $urssaf = new DeclarationHistoryUrssafData(
                    period: $period['key'],
                    total: MoneyData::fromMoney($settings->urssafContributionsOn($base)),
                    completion: $this->completion($completions, FiscalDeadlineKind::UrssafDeclaration, $period['key']),
                );
            }

            if ($existed && $chain instanceof Ca3Chain) {
                $boxes = $month->lessThan($chain->firstMonth)
                    ? new Ca3Chain($collected, $chain->expenses, $month)->boxes($month)
                    : $chain->boxes($month);
                $vat = new DeclarationHistoryVatData(
                    due: MoneyData::fromMoney(new Money($boxes->due, $currency)),
                    credit: MoneyData::fromMoney(new Money($boxes->credit, $currency)),
                    completion: $this->completion($completions, FiscalDeadlineKind::VatCa3, FiscalDeadline::monthKey($month)),
                );
            }

            $rows[] = new DeclarationHistoryRowData(period: FiscalDeadline::monthKey($month), urssaf: $urssaf, vat: $vat);
        }

        return $rows;
    }
}
