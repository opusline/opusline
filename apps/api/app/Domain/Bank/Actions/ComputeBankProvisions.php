<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Data\BankProvisionData;
use App\Domain\Bank\Data\BankProvisionsData;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
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
 * - plus the matelas as configured, verbatim.
 */
class ComputeBankProvisions
{
    private const int BASIS_POINTS = 10_000;

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
        $buffer = $settings->treasury_buffer_cents;

        $total = new Money(0, $currency);

        foreach ([$vat?->amount->toMoney(), $urssaf?->amount->toMoney(), $buffer] as $component) {
            if ($component !== null) {
                $total = $total->add($component);
            }
        }

        return new BankProvisionsData(
            vat: $vat,
            urssaf: $urssaf,
            buffer: $buffer === null ? null : MoneyData::fromMoney($buffer),
            total: MoneyData::fromMoney($total),
        );
    }

    /**
     * @return ?array{start: CarbonImmutable, previousStart: CarbonImmutable}
     */
    private function vatPeriod(UserSettings $settings, CarbonImmutable $today): ?array
    {
        if (! $settings->vat_regime->isLiable()) {
            return null;
        }

        $start = $settings->vat_regime === VatRegime::ReelSimplifie
            ? $today->startOfYear()
            : $today->startOfMonth();

        return [
            'start' => $start,
            'previousStart' => $settings->vat_regime === VatRegime::ReelSimplifie
                ? $start->subYear()
                : $start->subMonth(),
        ];
    }

    /**
     * @return ?array{start: CarbonImmutable, previousStart: CarbonImmutable}
     */
    private function urssafPeriod(UserSettings $settings, CarbonImmutable $today): ?array
    {
        if (! $settings->hasFrenchFiscality()) {
            return null;
        }

        $start = $settings->urssaf_periodicity === UrssafPeriodicity::Quarterly
            ? $today->firstOfQuarter()
            : $today->startOfMonth();

        return [
            'start' => $start,
            'previousStart' => $settings->urssaf_periodicity === UrssafPeriodicity::Quarterly
                ? $start->subMonths(3)
                : $start->subMonth(),
        ];
    }

    /**
     * One query over the widest window either component looks at; the
     * per-period sums are bucketed from this set in PHP.
     *
     * @param  ?array{start: CarbonImmutable, previousStart: CarbonImmutable}  $vatPeriod
     * @param  ?array{start: CarbonImmutable, previousStart: CarbonImmutable}  $urssafPeriod
     * @return Collection<int, Invoice>
     */
    private function collectedInvoices(
        User $user,
        CarbonImmutable $today,
        ?array $vatPeriod,
        ?array $urssafPeriod,
    ): Collection {
        $starts = array_filter([$vatPeriod['previousStart'] ?? null, $urssafPeriod['previousStart'] ?? null]);

        if ($starts === []) {
            return new Collection;
        }

        return $user->invoices()
            ->where('status', InvoiceStatus::Paid)
            ->whereBetween('paid_on', [min($starts)->toDateString(), $today->toDateString()])
            ->get(['paid_on', 'amount_ht_cents', 'amount_ttc_cents', 'currency']);
    }

    /**
     * @param  array{start: CarbonImmutable, previousStart: CarbonImmutable}  $period
     * @param  Collection<int, Invoice>  $collected
     * @param  Collection<int, BankMovement>  $movements
     */
    private function vat(
        array $period,
        Collection $collected,
        Collection $movements,
        CarbonImmutable $today,
        string $currency,
    ): BankProvisionData {
        $current = $this->vatAccruedBetween($collected, $period['start'], $today);
        $carried = max(
            0,
            $this->vatAccruedBetween($collected, $period['previousStart'], $period['start']->subDay())
                - $this->paymentsBetween($movements, $period['start'], $today, DetectFiscPayments::isVat(...)),
        );

        return new BankProvisionData(
            amount: MoneyData::fromMoney(new Money($current + $carried, $currency)),
            rateBp: null,
        );
    }

    /**
     * @param  array{start: CarbonImmutable, previousStart: CarbonImmutable}  $period
     * @param  Collection<int, Invoice>  $collected
     * @param  Collection<int, BankMovement>  $movements
     */
    private function urssaf(
        UserSettings $settings,
        array $period,
        Collection $collected,
        Collection $movements,
        CarbonImmutable $today,
        string $currency,
    ): BankProvisionData {
        $rateBp = $settings->effectiveContributionRateBp();

        $current = $this->contributionsAccruedBetween($collected, $period['start'], $today, $rateBp, $currency);
        $carried = max(
            0,
            $this->contributionsAccruedBetween($collected, $period['previousStart'], $period['start']->subDay(), $rateBp, $currency)
                - $this->paymentsBetween($movements, $period['start'], $today, DetectFiscPayments::isUrssaf(...)),
        );

        return new BankProvisionData(
            amount: MoneyData::fromMoney(new Money($current + $carried, $currency)),
            rateBp: $rateBp,
        );
    }

    /**
     * The TVA is per-invoice actuals, and ttc − ht is exactly vatAmount().
     *
     * @param  Collection<int, Invoice>  $collected
     */
    private function vatAccruedBetween(Collection $collected, CarbonImmutable $start, CarbonImmutable $end): int
    {
        return (int) $this->paidBetween($collected, $start, $end)
            ->sum(static fn (Invoice $invoice): int => (int) $invoice->amount_ttc_cents->getAmount()
                - (int) $invoice->amount_ht_cents->getAmount());
    }

    /**
     * @param  Collection<int, Invoice>  $collected
     */
    private function contributionsAccruedBetween(
        Collection $collected,
        CarbonImmutable $start,
        CarbonImmutable $end,
        int $rateBp,
        string $currency,
    ): int {
        $collectedHt = new Money(
            (int) $this->paidBetween($collected, $start, $end)
                ->sum(static fn (Invoice $invoice): int => (int) $invoice->amount_ht_cents->getAmount()),
            $currency,
        );

        return (int) $collectedHt
            ->multiply($rateBp)
            ->divide(self::BASIS_POINTS, MoneyPhp::ROUND_HALF_UP)
            ->getAmount();
    }

    /**
     * Date-string bounds so the bucketing matches what a whereBetween on the
     * date column would have returned.
     *
     * @param  Collection<int, Invoice>  $collected
     * @return Collection<int, Invoice>
     */
    private function paidBetween(Collection $collected, CarbonImmutable $start, CarbonImmutable $end): Collection
    {
        $startDate = $start->toDateString();
        $endDate = $end->toDateString();

        return $collected->filter(
            static fn (Invoice $invoice): bool => $invoice->paid_on !== null
                && $invoice->paid_on->toDateString() >= $startDate
                && $invoice->paid_on->toDateString() <= $endDate,
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
