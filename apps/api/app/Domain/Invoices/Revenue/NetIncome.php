<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Revenue;

use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Settings\Rates\ContributionRateHistory;
use App\Domain\Settings\Rates\ContributionRateTimeline;
use App\Domain\Shared\Fiscality\MicroBnc;
use App\Domain\Shared\Money\Rate;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use LogicException;

/**
 * What an amount HT leaves the freelance once the treasury has set aside what
 * it owes on it — the same deductions « Virable » makes, priced for one amount
 * instead of a period's receipts:
 *
 * - the URSSAF settlement (cotisations, CFP, and the versement libératoire
 *   when the option is on), at the rate the declaration of the period it is
 *   collected in settles at;
 * - without the versement libératoire, the income tax at the avis's
 *   withholding rate on the amount less the 34 % micro-BNC abatement.
 *
 * Not deducted: the TVA (the base is already HT), the CFE, the subscriptions
 * and the matelas — none of them grows with a receipt. The abatement's 305 €
 * floor is annual and left out, so a year whose receipts stay under it sees a
 * slightly higher tax here than the treasury carries.
 */
final readonly class NetIncome
{
    private function __construct(
        private UserSettings $settings,
        private ContributionRateTimeline $rates,
    ) {}

    /** Null outside French fiscality, where Opusline knows of nothing to deduct. */
    public static function forAccount(UserSettings $settings, ContributionRateHistory $history): ?self
    {
        return $settings->hasFrenchFiscality() ? new self($settings, $history->timeline($settings)) : null;
    }

    /**
     * Null for a draft, whose amount can still change. A paid invoice is priced
     * on the day it was paid; anything else on today, as it would be collected
     * under today's terms.
     */
    public function ofInvoice(Invoice $invoice): ?Money
    {
        if ($invoice->status === InvoiceStatus::Draft) {
            return null;
        }

        return $this->of($invoice->amount_ht_cents, $invoice->paid_on ?? $this->settings->today());
    }

    public function of(Money $ht, CarbonImmutable $collectedOn): Money
    {
        $contributions = $this->rates->contributionsFor($ht, $this->urssafPeriodEnd($collectedOn));

        return $ht->subtract($contributions)->subtract($this->incomeTaxOn($ht, $collectedOn));
    }

    private function urssafPeriodEnd(CarbonImmutable $collectedOn): CarbonImmutable
    {
        return $this->settings->urssaf_periodicity === UrssafPeriodicity::Quarterly
            ? $collectedOn->lastOfQuarter()
            : $collectedOn->endOfMonth();
    }

    private function incomeTaxOn(Money $ht, CarbonImmutable $collectedOn): Money
    {
        $none = new Money(0, $ht->getCurrency()->getCode());

        if (! $this->settings->owesIncomeTax()) {
            return $none;
        }

        // A month the option was in force on owes nothing more: its tax left with the URSSAF.
        if ($this->rates->liberatingPaymentOn($collectedOn->endOfMonth())?->isPaid === true) {
            return $none;
        }

        $rateBp = $this->settings->income_tax_rate_bp ?? throw new LogicException('An account with no withholding rate owes no income tax.');
        $taxable = $ht->subtract(Rate::of($ht, MicroBnc::ABATEMENT_RATE_BP));

        return Rate::of($taxable, $rateBp);
    }
}
