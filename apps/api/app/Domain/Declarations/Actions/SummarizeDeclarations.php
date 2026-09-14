<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Actions;

use App\Domain\Deadlines\Actions\GenerateFiscalDeadlines;
use App\Domain\Deadlines\Calendar\FiscalDeadline;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Declarations\Data\Ca3BoxesData;
use App\Domain\Declarations\Data\ContributionLineData;
use App\Domain\Declarations\Data\DeclarationCompletionData;
use App\Domain\Declarations\Data\DeclarationDeadlineData;
use App\Domain\Declarations\Data\DeclarationsData;
use App\Domain\Declarations\Data\RevenueCeilingData;
use App\Domain\Declarations\Data\SummarizeDeclarationsData;
use App\Domain\Declarations\Data\UrssafDeclarationData;
use App\Domain\Declarations\Data\VatDeclarationData;
use App\Domain\Declarations\Vat\Ca3Chain;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Expenses\Vat\DeductibleExpenses;
use App\Domain\Invoices\Enums\InvoiceStatus;
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
use Illuminate\Support\Collection;
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
    public function __construct(private readonly GenerateFiscalDeadlines $generateFiscalDeadlines) {}

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

        if ($monthStart->greaterThanOrEqualTo($currentMonth)) {
            throw ValidationException::withMessages(['period' => __('declarations.future_period')]);
        }

        $urssaf = $vat = $cumulative = null;

        if ($settings->hasFrenchFiscality()) {
            $completions = $user->fiscalDeadlineCompletions()->get();
            $declared = DeclaredCa3Months::fromCompletions($completions);
            $urssafPeriod = $this->urssafPeriod($settings, $monthStart, $currentMonth);
            $chainStart = $settings->filesMonthlyCa3() ? $this->chainStart($user, $settings, $declared, $monthStart) : null;
            $collected = CollectedInvoices::paidBetween(
                $user,
                min($urssafPeriod['start'], $monthStart->startOfYear(), $chainStart ?? $monthStart),
                max($urssafPeriod['end'], $monthStart->endOfMonth()),
            );
            $deadlines = $this->generateFiscalDeadlines->handle(
                $settings,
                min($monthStart, $urssafPeriod['start']),
                max($monthStart->endOfMonth(), $urssafPeriod['end'])->addMonths(2)->endOfMonth(),
            );

            $urssaf = $this->urssaf($settings, $collected, $urssafPeriod, $monthStart, $deadlines, $completions, $today);
            $vat = $chainStart instanceof CarbonImmutable
                ? $this->vat($user, $settings, $collected, $declared, $chainStart, $monthStart, $deadlines, $today)
                : null;
            $cumulative = $this->cumulative($settings, $collected, $monthStart);
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
        );
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
     * The first month the CA3 chain runs from, and nothing is carried into.
     *
     * Once a return has been filed, the chain is anchored on the earliest
     * one: what came before was either declared by hand or never owed a
     * CA3, and either way the data cannot say what credit the fisc holds.
     * Before any return, the chain starts where the account's history does.
     */
    private function chainStart(User $user, UserSettings $settings, DeclaredCa3Months $declared, CarbonImmutable $monthStart): CarbonImmutable
    {
        $firstDeclared = $declared->earliest();

        if ($firstDeclared !== null) {
            return min(CarbonImmutable::parse($firstDeclared.'-01'), $monthStart);
        }

        $candidates = [$monthStart];

        if ($settings->business_started_on instanceof CarbonImmutable) {
            $candidates[] = $settings->business_started_on->startOfMonth();
        }

        $firstPaidOn = $user->invoices()->where('status', InvoiceStatus::Paid)->min('paid_on');
        $firstSpentOn = $user->expenses()->min('spent_on');

        foreach ([$firstPaidOn, $firstSpentOn] as $date) {
            if (is_string($date)) {
                $candidates[] = CarbonImmutable::parse($date)->startOfMonth();
            }
        }

        return min($candidates);
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

        return DeclarationCompletionData::on($completion?->completed_on);
    }

    /**
     * @param  Period  $period
     * @param  list<FiscalDeadline>  $deadlines
     * @param  Collection<int, FiscalDeadlineCompletion>  $completions
     */
    private function urssaf(
        UserSettings $settings,
        CollectedInvoices $collected,
        array $period,
        CarbonImmutable $monthStart,
        array $deadlines,
        Collection $completions,
        CarbonImmutable $today,
    ): UrssafDeclarationData {
        $base = new Money($collected->htCents($period['start'], $period['end']), $settings->currency->value);

        return new UrssafDeclarationData(
            period: $period['key'],
            periodicity: $settings->urssaf_periodicity,
            coversShownMonth: $monthStart->betweenIncluded($period['start'], $period['end']),
            base: MoneyData::fromMoney($base),
            invoiceCount: $collected->countBetween($period['start'], $period['end']),
            lines: array_map(ContributionLineData::fromLine(...), $settings->urssafContributionLines($base)),
            total: MoneyData::fromMoney($settings->urssafContributionsOn($base)),
            deadline: $this->deadline($deadlines, FiscalDeadlineKind::UrssafDeclaration, $period['key'], $today),
            completion: $this->completion($completions, FiscalDeadlineKind::UrssafDeclaration, $period['key']),
        );
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
     */
    private function vat(
        User $user,
        UserSettings $settings,
        CollectedInvoices $collected,
        DeclaredCa3Months $declared,
        CarbonImmutable $chainStart,
        CarbonImmutable $monthStart,
        array $deadlines,
        CarbonImmutable $today,
    ): VatDeclarationData {
        $month = FiscalDeadline::monthKey($monthStart);
        $monthEnd = $monthStart->endOfMonth();
        $currency = $settings->currency->value;
        $expenses = DeductibleExpenses::spentOrClaimedBetween($user, $chainStart, $monthEnd, $declared);
        $boxes = new Ca3Chain($collected, $expenses, $chainStart)->boxes($monthStart);

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
            completion: DeclarationCompletionData::on($declared->declaredOn($month)),
        );
    }
}
