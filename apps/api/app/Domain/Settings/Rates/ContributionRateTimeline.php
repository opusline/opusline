<?php

declare(strict_types=1);

namespace App\Domain\Settings\Rates;

use App\Domain\Settings\Models\ContributionRate;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Enums\ContributionLineKind;
use App\Domain\Shared\Fiscality\ContributionLine;
use App\Domain\Shared\Money\Rate;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;

/**
 * An account's recorded rates, loaded once so a run over many closed periods
 * prices each at the rate that applied then without a query apiece.
 */
final readonly class ContributionRateTimeline
{
    /**
     * @param  array<int, ContributionRate>  $recorded  most recent first
     */
    public function __construct(
        private UserSettings $settings,
        private array $recorded,
    ) {}

    public function onDate(CarbonImmutable $date): int
    {
        $recorded = $this->recordedOn($date);

        return $recorded instanceof ContributionRate
            ? $recorded->effective_rate_bp
            : $this->settings->effectiveContributionRateBp();
    }

    /**
     * The combined rate a period ending on $periodEnd is settled at: today's
     * while it is still running, the one that applied when it closed otherwise.
     */
    public function rateBpFor(CarbonImmutable $periodEnd): int
    {
        return $periodEnd->greaterThanOrEqualTo($this->settings->today())
            ? $this->settings->effectiveContributionRateBp()
            : $this->onDate($periodEnd);
    }

    /**
     * What the URSSAF settles $base in for a period ending on $periodEnd, as
     * the lines the site lists.
     *
     * A period still on today's rate — a running one, or a closed one nothing
     * has repriced — is settled line by line, each rounded on its own the way
     * the site does. A period that closed under a rate since replaced is
     * settled at that rate on the whole base, which is exactly how
     * ComputeBankProvisions carries it: the treasury and the Déclarations
     * screen must never name two figures for one return. ContributionRate
     * records only the combined rate, not the cotisations, CFP and versement
     * libératoire it was made of, so a repriced period has no breakdown left
     * to show and comes back as the single line the fisc will debit.
     *
     * @return list<ContributionLine>
     */
    public function contributionLinesFor(Money $base, CarbonImmutable $periodEnd): array
    {
        $rateBp = $this->rateBpFor($periodEnd);

        if ($rateBp === $this->settings->effectiveContributionRateBp()) {
            return $this->settings->urssafContributionLines($base);
        }

        return [new ContributionLine(ContributionLineKind::SocialContributions, $rateBp, Rate::of($base, $rateBp))];
    }

    /** The lines summed: what the declaration of that period will debit. */
    public function contributionsFor(Money $base, CarbonImmutable $periodEnd): Money
    {
        return Money::sum(...array_map(
            static fn (ContributionLine $line): Money => $line->amount,
            $this->contributionLinesFor($base, $periodEnd),
        ));
    }

    /**
     * Whether the versement libératoire was in force on $date, and at what
     * rate — null when nothing recorded can say. An account that never moved
     * its terms holds no rows at all, and the rows written before the option
     * started being recorded carry no answer either.
     */
    public function liberatingPaymentOn(CarbonImmutable $date): ?LiberatingPayment
    {
        $recorded = $this->recordedOn($date);

        if (! $recorded instanceof ContributionRate || $recorded->liberating_payment === null) {
            return null;
        }

        return new LiberatingPayment($recorded->liberating_payment, $recorded->liberating_payment_rate_bp ?? 0);
    }

    /**
     * The row that applied on $date — none when the date predates everything
     * recorded, where the settings are the only figure there is.
     */
    private function recordedOn(CarbonImmutable $date): ?ContributionRate
    {
        $dateString = $date->toDateString();

        foreach ($this->recorded as $rate) {
            if ($rate->effective_from->toDateString() <= $dateString) {
                return $rate;
            }
        }

        return null;
    }
}
