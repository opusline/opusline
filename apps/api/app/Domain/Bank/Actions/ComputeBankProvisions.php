<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankProvisionData;
use App\Domain\Bank\Data\BankProvisionsData;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Deadlines\Actions\ResolveExpectedCfe;
use App\Domain\Deadlines\Calendar\CfeSchedule;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;

/**
 * What the fisc is still owed, computed on collections (encaissements)
 * because micro-régime TVA and URSSAF are both cash-basis:
 *
 * - the running period's accrual: TVA actually carried by the invoices paid
 *   inside it (calendar month under réel normal, calendar year under réel
 *   simplifié; null under the franchise en base), and the contribution rate
 *   applied to the HT collected inside it (month or quarter per the
 *   settings; null outside French fiscality);
 * - plus the previous period's accrual, carried until the matching payment
 *   shows up in the imported movements — France pays in arrears, so the
 *   URSSAF prélèvement or TVA télérèglement detected in the current period
 *   settles that carried debt, clamped at zero. Known limit: the carry is
 *   priced at today's contribution rate — no rate history is stored, so a
 *   rate change at a period boundary (an ACRE step ending) re-prices the
 *   carried period until its payment lands;
 * - plus a twelfth of the expected CFE per elapsed month, netted the same way
 *   against detected CFE debits;
 * - plus the matelas as configured, verbatim.
 */
class ComputeBankProvisions
{
    public function __construct(private readonly ResolveExpectedCfe $resolveExpectedCfe) {}

    /**
     * @param  Collection<int, BankMovement>  $movements  every movement of $user, any order
     */
    public function handle(User $user, Collection $movements): BankProvisionsData
    {
        $settings = $user->settingsOrFail();
        $currency = $settings->currency->value;
        $today = $settings->today();

        $vatPeriod = $this->vatPeriod($settings, $today);
        $urssafPeriod = $this->urssafPeriod($settings, $today);
        $collected = $this->collectedInvoices($user, $today, $vatPeriod, $urssafPeriod);

        $vat = $vatPeriod === null ? null : $this->vat($vatPeriod, $collected, $movements, $today, $currency);
        $urssaf = $urssafPeriod === null ? null : $this->urssaf($settings, $urssafPeriod, $collected, $movements, $today, $currency);
        $cfe = $this->cfe($settings, $movements, $today, $currency);
        $buffer = $settings->treasury_buffer_cents;

        $total = new Money(0, $currency);

        foreach ([$vat?->amount->toMoney(), $urssaf?->amount->toMoney(), $cfe?->amount->toMoney(), $buffer] as $component) {
            if ($component !== null) {
                $total = $total->add($component);
            }
        }

        return new BankProvisionsData(
            vat: $vat,
            urssaf: $urssaf,
            cfe: $cfe,
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
     * One query over the widest window either component looks at; the
     * per-period sums are bucketed from this set in PHP.
     *
     * @param  ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $vatPeriod
     * @param  ?array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $urssafPeriod
     */
    private function collectedInvoices(
        User $user,
        CarbonImmutable $today,
        ?array $vatPeriod,
        ?array $urssafPeriod,
    ): CollectedInvoices {
        $starts = array_filter([$vatPeriod['previousStart'] ?? null, $urssafPeriod['previousStart'] ?? null]);

        if ($starts === []) {
            return CollectedInvoices::none();
        }

        return CollectedInvoices::paidBetween($user, min($starts), $today);
    }

    /**
     * @param  array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $period
     * @param  Collection<int, BankMovement>  $movements
     */
    private function vat(
        array $period,
        CollectedInvoices $collected,
        Collection $movements,
        CarbonImmutable $today,
        string $currency,
    ): BankProvisionData {
        $current = $collected->vatCents($period['start'], $today);
        $carried = max(
            0,
            $collected->vatCents($period['previousStart'], $period['start']->subDay())
                - $this->paymentsBetween($movements, $period['start'], $today, DetectFiscPayments::isVat(...)),
        );

        return new BankProvisionData(
            amount: MoneyData::fromMoney(new Money($current + $carried, $currency)),
            rateBp: null,
            periodEnd: $period['end'],
        );
    }

    /**
     * @param  array{start: CarbonImmutable, end: CarbonImmutable, previousStart: CarbonImmutable}  $period
     * @param  Collection<int, BankMovement>  $movements
     */
    private function urssaf(
        UserSettings $settings,
        array $period,
        CollectedInvoices $collected,
        Collection $movements,
        CarbonImmutable $today,
        string $currency,
    ): BankProvisionData {
        $rateBp = $settings->effectiveContributionRateBp();

        $current = $collected->contributionsCents($period['start'], $today, $rateBp, $currency);
        $carried = max(
            0,
            $collected->contributionsCents($period['previousStart'], $period['start']->subDay(), $rateBp, $currency)
                - $this->paymentsBetween($movements, $period['start'], $today, DetectFiscPayments::isUrssaf(...)),
        );

        return new BankProvisionData(
            amount: MoneyData::fromMoney(new Money($current + $carried, $currency)),
            rateBp: $rateBp,
            periodEnd: $period['end'],
        );
    }

    /**
     * The commune sets the CFE, so there is nothing to provision until the user
     * has said what to expect — and nothing at all in an exempt year; see
     * CfeSchedule, which the Échéances calendar reads too.
     *
     * Built a twelfth a month rather than locked whole in January: the bill only
     * lands on 15 December, and until then the account owes the elapsed share.
     *
     * @param  Collection<int, BankMovement>  $movements
     */
    private function cfe(
        UserSettings $settings,
        Collection $movements,
        CarbonImmutable $today,
        string $currency,
    ): ?BankProvisionData {
        if (! $settings->hasFrenchFiscality()) {
            return null;
        }

        // The entered amount, or last year's payment standing in for it — the
        // same resolution the Échéances screen shows, so the two never disagree.
        $expected = $this->resolveExpectedCfe->handle($settings)?->amount;

        if (! $expected instanceof Money) {
            return null;
        }

        if (CfeSchedule::isExemptYear($settings, $today->year)) {
            return null;
        }

        $accrued = intdiv((int) $expected->getAmount() * $today->month, 12);
        $paid = $this->paymentsBetween($movements, $today->startOfYear(), $today, DetectFiscPayments::isCfe(...));

        return new BankProvisionData(
            amount: MoneyData::fromMoney(new Money(max(0, $accrued - $paid), $currency)),
            rateBp: null,
            periodEnd: $today->endOfYear(),
        );
    }

    /**
     * The fisc's debits detected in the imported movements over the window,
     * as positive cents.
     *
     * @param  Collection<int, BankMovement>  $movements
     * @param  callable(string): bool  $matchesLabel
     */
    private function paymentsBetween(
        Collection $movements,
        CarbonImmutable $start,
        CarbonImmutable $end,
        callable $matchesLabel,
    ): int {
        $startDate = $start->toDateString();
        $endDate = $end->toDateString();
        $total = 0;

        foreach ($movements as $movement) {
            $cents = (int) $movement->amount_cents->getAmount();

            if ($cents >= 0) {
                continue;
            }

            $bookedOn = $movement->booked_on->toDateString();

            if ($bookedOn >= $startDate && $bookedOn <= $endDate && $matchesLabel($movement->label)) {
                $total += -$cents;
            }
        }

        return $total;
    }
}
