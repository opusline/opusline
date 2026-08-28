<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Calendar\CfeSchedule;
use App\Domain\Deadlines\Calendar\DeadlineAmount;
use App\Domain\Deadlines\Calendar\ExpectedCfe;
use App\Domain\Deadlines\Calendar\FiscalDeadline;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Money\Rate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;

/**
 * What each occurrence is expected to cost.
 *
 * Two sources, never mixed: URSSAF and TVA are priced from what the account
 * actually collected over the period, the same cash-basis arithmetic the
 * treasury provisions use; the CFE and the income tax acompte are set by the
 * commune and the DGFiP, so they are whatever the user told us to expect.
 */
class PriceFiscalDeadlines
{
    /** The kinds the account's own collections can price. */
    private const array COLLECTION_BACKED = [
        FiscalDeadlineKind::UrssafDeclaration,
        FiscalDeadlineKind::VatCa3,
        FiscalDeadlineKind::VatCa12,
    ];

    /**
     * @param  list<FiscalDeadline>  $deadlines
     * @return array<string, DeadlineAmount> keyed by FiscalDeadline::key()
     */
    public function handle(
        User $user,
        UserSettings $settings,
        array $deadlines,
        ?ExpectedCfe $expectedCfe,
    ): array {
        $today = $settings->today();
        $currency = $settings->currency->value;
        $collected = $this->collections($user, $today, $deadlines);

        $prices = [];

        foreach ($deadlines as $deadline) {
            $prices[$deadline->key()] = $this->price($deadline, $settings, $collected, $expectedCfe, $today, $currency);
        }

        return $prices;
    }

    private function price(
        FiscalDeadline $deadline,
        UserSettings $settings,
        CollectedInvoices $collected,
        ?ExpectedCfe $expectedCfe,
        CarbonImmutable $today,
        string $currency,
    ): DeadlineAmount {
        $rateBp = $settings->effectiveContributionRateBp();

        return match ($deadline->kind) {
            FiscalDeadlineKind::UrssafDeclaration => $this->onCollectedBase(
                $deadline,
                $today,
                $currency,
                $rateBp,
                static fn (CarbonImmutable $through): int => $collected->htCents($deadline->periodStart, $through),
            ),
            FiscalDeadlineKind::VatCa3, FiscalDeadlineKind::VatCa12 => $this->estimate(
                $deadline,
                $today,
                $currency,
                null,
                static fn (CarbonImmutable $through): int => $collected->vatCents($deadline->periodStart, $through),
            ),
            FiscalDeadlineKind::Cfe => $this->cfe($expectedCfe, CfeSchedule::balance(...)),
            FiscalDeadlineKind::CfeInstalment => $this->cfe($expectedCfe, CfeSchedule::instalment(...)),
        };
    }

    /**
     * A figure the account's own collections produce, summed up to today so a
     * running period reads as "so far". A period that has not started yet has
     * no amount at all: a zero there would say "you owe nothing" rather than
     * "there is nothing to go on".
     *
     * @param  callable(CarbonImmutable): int  $sum
     */
    private function estimate(
        FiscalDeadline $deadline,
        CarbonImmutable $today,
        string $currency,
        ?int $rateBp,
        callable $sum,
    ): DeadlineAmount {
        if ($deadline->periodStart->greaterThan($today)) {
            return new DeadlineAmount(amount: null, rateBp: $rateBp, isEstimate: true);
        }

        return new DeadlineAmount(
            amount: new Money($sum($this->through($deadline, $today)), $currency),
            rateBp: $rateBp,
            isEstimate: true,
        );
    }

    /**
     * A rate applied to a base the window collected, carrying both figures: the
     * screen names them together, and contributions = base × rate rounds, so the
     * base cannot be divided back out of the amount.
     *
     * @param  callable(CarbonImmutable): int  $base
     */
    private function onCollectedBase(
        FiscalDeadline $deadline,
        CarbonImmutable $today,
        string $currency,
        int $rateBp,
        callable $base,
    ): DeadlineAmount {
        if ($deadline->periodStart->greaterThan($today)) {
            return new DeadlineAmount(amount: null, rateBp: $rateBp, isEstimate: true);
        }

        $collected = new Money($base($this->through($deadline, $today)), $currency);

        return new DeadlineAmount(
            amount: Rate::of($collected, $rateBp),
            rateBp: $rateBp,
            isEstimate: true,
            base: $collected,
        );
    }

    /** A running period is summed up to today; a closed one, to its own end. */
    private function through(FiscalDeadline $deadline, CarbonImmutable $today): CarbonImmutable
    {
        return $deadline->periodEnd->lessThan($today) ? $deadline->periodEnd : $today;
    }

    /**
     * The commune's bill, or last year's payment standing in for it — in which
     * case the figure carries the estimate flag the resolution gave it.
     *
     * @param  callable(Money): Money  $share  which slice of the year this occurrence owes
     */
    private function cfe(?ExpectedCfe $expectedCfe, callable $share): DeadlineAmount
    {
        if (! $expectedCfe instanceof ExpectedCfe) {
            return new DeadlineAmount(amount: null, rateBp: null, isEstimate: false);
        }

        return new DeadlineAmount(
            amount: $share($expectedCfe->amount),
            rateBp: null,
            isEstimate: $expectedCfe->isEstimate,
        );
    }

    /**
     * One query over the widest window any collection-backed occurrence looks
     * at; the per-period sums are bucketed from that set in PHP.
     *
     * @param  list<FiscalDeadline>  $deadlines
     */
    private function collections(User $user, CarbonImmutable $today, array $deadlines): CollectedInvoices
    {
        $starts = [];

        foreach ($deadlines as $deadline) {
            if (in_array($deadline->kind, self::COLLECTION_BACKED, true)) {
                $starts[] = $deadline->periodStart;
            }
        }

        if ($starts === []) {
            return CollectedInvoices::none();
        }

        return CollectedInvoices::paidBetween($user, min($starts), $today);
    }
}
