<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Actions;

use App\Domain\Declarations\Data\LiberatingPaymentOutlookData;
use App\Domain\Declarations\Enums\LiberatingPaymentEndReason;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Fiscality\LiberatingPaymentThreshold;
use App\Domain\Shared\Fiscality\MicroBnc;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;

/**
 * When an account paying the versement libératoire has to stop, under the two
 * rules that end it on a 1 January: the household's revenu fiscal de référence
 * of two years before exceeds the limit for its parts, or the receipts crossed
 * the micro-BNC ceiling two calendar years running, which ends the régime the
 * option belongs to. The earlier end wins; on the same day the income reads
 * first, being the one the user can check on their avis.
 */
class ResolveLiberatingPaymentOutlook
{
    public function handle(User $user): ?LiberatingPaymentOutlookData
    {
        $settings = $user->settingsOrFail();

        if (! $settings->hasFrenchFiscality() || ! $settings->liberating_payment) {
            return null;
        }

        $today = $settings->today();
        $currency = $settings->currency->value;
        $incomeYear = $settings->reference_tax_income_year;
        $byIncome = $this->endByIncome($user, $today);
        $byCeiling = $this->endByCeiling($user, $today);
        $reason = match (true) {
            $byIncome instanceof CarbonImmutable && ! $byCeiling?->lessThan($byIncome) => LiberatingPaymentEndReason::ReferenceTaxIncome,
            $byCeiling instanceof CarbonImmutable => LiberatingPaymentEndReason::RevenueCeiling,
            default => null,
        };
        $endsOn = $reason === LiberatingPaymentEndReason::RevenueCeiling ? $byCeiling : $byIncome;
        $isIncomeReason = $reason === LiberatingPaymentEndReason::ReferenceTaxIncome;
        $limitCents = $isIncomeReason && $incomeYear !== null && $settings->tax_household_quarter_parts !== null
            ? LiberatingPaymentThreshold::centsFor(LiberatingPaymentThreshold::optionYearFor($incomeYear), $settings->tax_household_quarter_parts)
            : null;
        $ceilingCents = $reason === LiberatingPaymentEndReason::RevenueCeiling
            ? MicroBnc::ceilingCentsFor($endsOn->year - 1)
            : null;

        return new LiberatingPaymentOutlookData(
            endsOn: $endsOn,
            reason: $reason,
            referenceTaxIncome: $isIncomeReason && $settings->reference_tax_income_cents !== null
                ? MoneyData::fromMoney($settings->reference_tax_income_cents)
                : null,
            referenceTaxIncomeYear: $isIncomeReason ? $incomeYear : null,
            referenceTaxIncomeLimit: $limitCents === null ? null : MoneyData::fromMoney(new Money($limitCents, $currency)),
            taxHouseholdQuarterParts: $isIncomeReason ? $settings->tax_household_quarter_parts : null,
            ceiling: $ceilingCents === null ? null : MoneyData::fromMoney(new Money($ceilingCents, $currency)),
            // The avis of this summer only decides next year, so the RFR that
            // still vouches for the running year is the one two years back.
            needsReferenceTaxIncome: $incomeYear === null || LiberatingPaymentThreshold::optionYearFor($incomeYear) < $today->year,
        );
    }

    /**
     * The 1 January the entered RFR ends the option on, or null when it does
     * not — including when it is too old to speak for the running year, or
     * decides a year whose limit the finance law has not set.
     */
    private function endByIncome(User $user, CarbonImmutable $today): ?CarbonImmutable
    {
        $settings = $user->settingsOrFail();
        $income = $settings->reference_tax_income_cents;
        $incomeYear = $settings->reference_tax_income_year;
        $quarterParts = $settings->tax_household_quarter_parts;

        if ($income === null || $incomeYear === null || $quarterParts === null) {
            return null;
        }

        $optionYear = LiberatingPaymentThreshold::optionYearFor($incomeYear);
        $limitCents = LiberatingPaymentThreshold::centsFor($optionYear, $quarterParts);

        if ($optionYear < $today->year || $limitCents === null || (int) $income->getAmount() <= $limitCents) {
            return null;
        }

        return CarbonImmutable::create($optionYear, 1, 1);
    }

    /**
     * The 1 January after the second calendar year running over the ceiling:
     * last year and the year before (already past), or last year and this
     * one's receipts so far (the coming one).
     */
    private function endByCeiling(User $user, CarbonImmutable $today): ?CarbonImmutable
    {
        $thisYear = $today->startOfYear();
        $collected = CollectedInvoices::paidBetween($user, $thisYear->subYears(2), $today);
        $isOver = static function (CarbonImmutable $yearStart) use ($collected, $today): bool {
            $ceilingCents = MicroBnc::ceilingCentsFor($yearStart->year);

            return $ceilingCents !== null
                && $collected->htCents($yearStart, min($yearStart->endOfYear(), $today)) > $ceilingCents;
        };

        if (! $isOver($thisYear->subYear())) {
            return null;
        }

        if ($isOver($thisYear->subYears(2))) {
            return $thisYear;
        }

        return $isOver($thisYear) ? $thisYear->addYear() : null;
    }
}
