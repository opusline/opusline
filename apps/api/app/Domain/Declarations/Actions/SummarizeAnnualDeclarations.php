<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Actions;

use App\Domain\Deadlines\Actions\ResolveExpectedCfe;
use App\Domain\Deadlines\Calendar\CfeSchedule;
use App\Domain\Deadlines\Calendar\ExpectedCfe;
use App\Domain\Deadlines\Calendar\FiscalDeadline;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Models\FiscalDeadlineCompletion;
use App\Domain\Declarations\Data\AnnualDeclarationsData;
use App\Domain\Declarations\Data\CfeReturnData;
use App\Domain\Declarations\Data\DeclarationCompletionData;
use App\Domain\Declarations\Data\IncomeTaxReturnData;
use App\Domain\Declarations\Data\IncomeTaxReturnPeriodData;
use App\Domain\Declarations\Enums\IncomeTaxReturnBox;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Shared\Fiscality\MicroBnc;
use App\Domain\Shared\Money\Rate;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;

/**
 * The « Annuel » card of the Déclarations screen: the two returns of the
 * year the shown month belongs to — the 2042-C PRO and the CFE. Null for a
 * year that closed before the business existed: the fisc never asked.
 *
 * @phpstan-type Period array{start: CarbonImmutable, end: CarbonImmutable, key: string}
 */
class SummarizeAnnualDeclarations
{
    public function __construct(private readonly ResolveExpectedCfe $resolveExpectedCfe) {}

    /**
     * @param  Collection<int, FiscalDeadlineCompletion>  $completions
     * @param  list<FiscalDeadline>  $deadlines  covering the year and the spring after it
     */
    public function handle(
        UserSettings $settings,
        CollectedInvoices $collected,
        Collection $completions,
        array $deadlines,
        CarbonImmutable $monthStart,
        CarbonImmutable $today,
    ): ?AnnualDeclarationsData {
        $year = $monthStart->year;
        $yearStart = $monthStart->startOfYear();
        $yearEnd = $monthStart->endOfYear();
        $currency = $settings->currency->value;
        $incomeTaxDueOn = FiscalDeadline::find($deadlines, FiscalDeadlineKind::IncomeTaxReturn, (string) $year)?->dueOn;
        $cfeDueOn = FiscalDeadline::find($deadlines, FiscalDeadlineKind::Cfe, (string) $year)?->dueOn;

        if (! $incomeTaxDueOn instanceof CarbonImmutable) {
            return null;
        }

        $gross = new Money($collected->htCents($yearStart, $yearEnd), $currency);
        $periods = [];
        $liberatingPaid = new Money(0, $currency);

        foreach ($this->urssafPeriodsOf($settings, $yearStart) as $period) {
            $base = new Money($collected->htCents($period['start'], $period['end']), $currency);
            $periods[] = new IncomeTaxReturnPeriodData(
                period: $period['key'],
                base: MoneyData::fromMoney($base),
                declaredOn: DeclarationCompletionData::in($completions, FiscalDeadlineKind::UrssafDeclaration, $period['key'])?->declaredOn,
            );
            // Summed per declaration, as the URSSAF rounded each one: the cents can differ from a rate on the year.
            $liberatingPaid = $liberatingPaid->add(Rate::of($base, $settings->liberating_payment_rate_bp));
        }

        return new AnnualDeclarationsData(
            incomeTaxReturn: new IncomeTaxReturnData(
                year: $year,
                dueOn: $incomeTaxDueOn,
                grossReceipts: MoneyData::fromMoney($gross),
                box: $settings->liberating_payment ? IncomeTaxReturnBox::WithLiberatingPayment : IncomeTaxReturnBox::WithoutLiberatingPayment,
                periods: $periods,
                taxableAfterAbatement: MoneyData::fromMoney(Money::max(new Money(0, $currency), $gross->subtract(MicroBnc::abatementOf($gross)))),
                liberatingPaymentPaid: $settings->liberating_payment ? MoneyData::fromMoney($liberatingPaid) : null,
                completion: DeclarationCompletionData::in($completions, FiscalDeadlineKind::IncomeTaxReturn, (string) $year),
            ),
            cfe: $cfeDueOn instanceof CarbonImmutable ? $this->cfe($settings, $completions, $year, $cfeDueOn, $today) : null,
        );
    }

    /**
     * The commune's bill can only be guessed for the running year — the
     * resolution reads last year's payment or the barème against today. An
     * older year shows what was ticked, nothing more; and once the payment
     * is recorded the twelfths have nothing left to hold.
     *
     * @param  Collection<int, FiscalDeadlineCompletion>  $completions
     */
    private function cfe(UserSettings $settings, Collection $completions, int $year, CarbonImmutable $dueOn, CarbonImmutable $today): CfeReturnData
    {
        $isRunningYear = $year === $today->year;
        $completion = DeclarationCompletionData::in($completions, FiscalDeadlineKind::Cfe, (string) $year);
        $expected = $isRunningYear ? $this->resolveExpectedCfe->handle($settings) : null;
        $provisioned = $gap = null;

        if ($expected instanceof ExpectedCfe && ! $completion?->paidOn instanceof CarbonImmutable) {
            $provisioned = CfeSchedule::accruedBy($expected->amount, $today->month);
            $gap = $provisioned->subtract($expected->amount);
        }

        return new CfeReturnData(
            year: $year,
            dueOn: $dueOn,
            expected: $expected instanceof ExpectedCfe ? MoneyData::fromMoney($expected->amount) : null,
            isEstimate: $expected instanceof ExpectedCfe && $expected->isEstimate,
            provisioned: $provisioned instanceof Money ? MoneyData::fromMoney($provisioned) : null,
            gap: $gap instanceof Money ? SignedMoneyData::fromMoney($gap) : null,
            monthsProvisioned: $isRunningYear ? $today->month : 12,
            completion: $completion,
        );
    }

    /**
     * The 2042 asks the year's receipts to be reconciled against each URSSAF
     * declaration — twelve months or four quarters, from the first one the
     * business existed for.
     *
     * @return list<Period>
     */
    private function urssafPeriodsOf(UserSettings $settings, CarbonImmutable $yearStart): array
    {
        $quarterly = $settings->urssaf_periodicity === UrssafPeriodicity::Quarterly;
        $startedOn = $settings->business_started_on;
        $periods = [];

        for ($start = $yearStart; $start->year === $yearStart->year; $start = $start->addMonths($quarterly ? 3 : 1)) {
            $end = $quarterly ? $start->lastOfQuarter() : $start->endOfMonth();

            if ($startedOn instanceof CarbonImmutable && $end->lessThan($startedOn)) {
                continue;
            }

            $periods[] = ['start' => $start, 'end' => $end, 'key' => $quarterly ? FiscalDeadline::quarterKey($start) : FiscalDeadline::monthKey($start)];
        }

        return $periods;
    }
}
