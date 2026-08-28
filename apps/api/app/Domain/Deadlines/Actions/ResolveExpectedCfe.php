<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Bank\Actions\DetectFiscPayments;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Deadlines\Calendar\CfeBareme;
use App\Domain\Deadlines\Calendar\ExpectedCfe;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Settings\Models\UserSettings;
use Cknow\Money\Money;

/**
 * The year's expected CFE, from the best source available:
 *
 * 1. what the user entered in Réglages;
 * 2. what actually left the pro account for it last year, read from the
 *    imported movements — the commune only nudges the bill year to year;
 * 3. failing both, a rough figure off the statutory barème and the account's
 *    own collected revenue — see CfeBareme for how rough, and why it is still
 *    better than a December bill nobody saw coming.
 */
class ResolveExpectedCfe
{
    public function handle(UserSettings $settings): ?ExpectedCfe
    {
        if ($settings->cfe_expected_cents !== null) {
            return new ExpectedCfe($settings->cfe_expected_cents, isEstimate: false);
        }

        $previousYear = $settings->today()->subYear();

        $paidCents = 0;

        $movements = BankMovement::query()
            ->where('user_id', $settings->user_id)
            ->whereBetween('booked_on', [
                $previousYear->startOfYear()->toDateString(),
                $previousYear->endOfYear()->toDateString(),
            ])
            ->get(['amount_cents', 'label', 'currency']);

        foreach ($movements as $movement) {
            $cents = (int) $movement->amount_cents->getAmount();

            if ($cents < 0 && DetectFiscPayments::isCfe($movement->label)) {
                $paidCents += -$cents;
            }
        }

        if ($paidCents > 0) {
            return new ExpectedCfe(new Money($paidCents, $settings->currency->value), isEstimate: true);
        }

        return $this->fromBareme($settings, $previousYear->year);
    }

    /**
     * The barème wants CA N-2, but the nearest full year the app can see is a
     * fair stand-in — and an account too young to have one falls back to what
     * this year has collected so far, so the rough idea exists from the first
     * paid invoice rather than only from the second January.
     */
    private function fromBareme(UserSettings $settings, int $previousYear): ?ExpectedCfe
    {
        $revenueCents = $this->collectedHtCents($settings, $previousYear);

        if ($revenueCents === 0) {
            $revenueCents = $this->collectedHtCents($settings, $previousYear + 1);
        }

        $estimate = CfeBareme::estimate($revenueCents, $settings->currency->value);

        return $estimate instanceof Money ? new ExpectedCfe($estimate, isEstimate: true) : null;
    }

    private function collectedHtCents(UserSettings $settings, int $year): int
    {
        return (int) Invoice::query()
            ->where('user_id', $settings->user_id)
            ->where('status', InvoiceStatus::Paid)
            ->whereBetween('paid_on', [
                sprintf('%d-01-01', $year),
                sprintf('%d-12-31', $year),
            ])
            ->sum('amount_ht_cents');
    }
}
