<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\MissionBillingProgressData;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use Cknow\Money\Money;

/**
 * A forfait is sold as one price and billed in instalments — 30% on signature,
 * 40% at a milestone, the rest on delivery. Nothing in the schema needed to
 * change for that: several invoices already carry the same mission_id. What was
 * missing is the arithmetic that says how far through the agreed price you are,
 * and whether you have gone past it.
 *
 * Deliberately derived rather than stored: an instalment plan would be a second
 * source of truth about money the invoices already record, and it would be wrong
 * the moment one is edited.
 */
class SummarizeMissionBilling
{
    private const int BASIS_POINTS = 10_000;

    public function handle(Mission $mission): ?MissionBillingProgressData
    {
        // Only a forfait has an agreed total; a day rate has no denominator.
        if ($mission->billing_mode !== BillingMode::Fixed || $mission->rate_cents === null) {
            return null;
        }

        $fixedPrice = $mission->rate_cents;
        $currency = $fixedPrice->getCurrency()->getCode();

        $invoices = $mission->invoices()->get(['status', 'amount_ht_cents', 'currency']);

        $invoiced = new Money(0, $currency);
        $issuedCount = 0;
        $draftCount = 0;

        foreach ($invoices as $invoice) {
            // A draft is a note to self, not a bill — it counts nothing toward
            // the price, but the reader still wants to know it is sitting there.
            if (! $invoice->status->isIssued()) {
                $draftCount++;

                continue;
            }

            $invoiced = $invoiced->add($invoice->amount_ht_cents);
            $issuedCount++;
        }

        $priceCents = (int) $fixedPrice->getAmount();
        $invoicedCents = (int) $invoiced->getAmount();

        return new MissionBillingProgressData(
            fixedPrice: MoneyData::fromMoney($fixedPrice),
            invoiced: MoneyData::fromMoney($invoiced),
            remaining: SignedMoneyData::fromMoney($fixedPrice->subtract($invoiced)),
            progressBp: $priceCents === 0
                ? 0
                : intdiv($invoicedCents * self::BASIS_POINTS, $priceCents),
            isOverBilled: $invoicedCents > $priceCents,
            issuedCount: $issuedCount,
            draftCount: $draftCount,
        );
    }
}
