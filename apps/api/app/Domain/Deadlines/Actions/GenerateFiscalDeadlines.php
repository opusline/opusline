<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Cra\Calendar\Holidays;
use App\Domain\Deadlines\Calendar\CfeSchedule;
use App\Domain\Deadlines\Calendar\DeadlinePeriod;
use App\Domain\Deadlines\Calendar\DeadlineWindow;
use App\Domain\Deadlines\Calendar\FiscalDeadline;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Settings\Models\UserSettings;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Cknow\Money\Money;

/**
 * The fiscal calendar of one account, derived from its profile alone.
 *
 * Nothing is materialised: an occurrence is recomputed on every request, so
 * switching from monthly to quarterly URSSAF or leaving the franchise en base
 * rewrites the calendar with no backfill and no stale rows. Only the user's own
 * marks — completions, the read watermark — are stored, keyed by period.
 *
 * Deliberately pure: no database, no money, no clock. `$from`/`$to` come from
 * the caller so the same rules serve the screen, the reminders and the ICS feed.
 */
class GenerateFiscalDeadlines
{
    /**
     * How far back a period can start and still have its due date land inside
     * the window. The widest of the three generators that scan by month is the
     * quarterly URSSAF, declared by the end of the month after its quarter —
     * four months. The annual kinds scan by year and do not use this.
     */
    private const int LOOKBACK_MONTHS = 4;

    private const int CFE_INSTALMENT_DAY = 15;

    private const int CFE_DAY = 15;

    /**
     * The legal filing window is the 15th to the 24th of the following month,
     * with the exact day depending on the taxpayer's own situation. The
     * earliest of the range is used for everyone: a reminder that is up to nine
     * days early costs nothing, one that is late costs a penalty.
     */
    private const int CA3_DAY = 15;

    /**
     * A fingerprint of the calendar this profile produces, for telling whether a
     * settings save rewrote it.
     *
     * Taken from the output rather than from a list of the inputs: a rule that
     * gains an input would otherwise need someone to remember a second list, and
     * forgetting it is invisible. Cheap enough to run twice on a save — this
     * action touches neither the database nor the clock.
     */
    public function signature(UserSettings $settings, ?Money $expectedCfe): string
    {
        $window = DeadlineWindow::onScreen($settings->today());

        return implode('|', array_map(
            static fn (FiscalDeadline $deadline): string => $deadline->key().'@'.$deadline->dueOn->toDateString(),
            $this->handle($settings, $window->from, $window->to, $expectedCfe),
        ));
    }

    /**
     * Every occurrence due inside [$from, $to], oldest first.
     *
     * @param  ?Money  $expectedCfe  the year's resolved CFE — see ResolveExpectedCfe;
     *                               it decides whether the June acompte exists
     * @return list<FiscalDeadline>
     */
    public function handle(
        UserSettings $settings,
        CarbonImmutable $from,
        CarbonImmutable $to,
        ?Money $expectedCfe = null,
    ): array {
        if (! $settings->hasFrenchFiscality()) {
            return [];
        }

        $deadlines = [
            ...$this->urssaf($settings, $from, $to),
            ...$this->vat($settings, $from, $to),
            ...$this->cfe($settings, $from, $to, $expectedCfe),
        ];

        usort(
            $deadlines,
            static fn (FiscalDeadline $a, FiscalDeadline $b): int => [$a->dueOn->toDateString(), $a->kind->value]
                <=> [$b->dueOn->toDateString(), $b->kind->value],
        );

        return $this->sinceTheBusinessExisted($deadlines, $settings->business_started_on);
    }

    /**
     * A period that closed before the business opened was never the account's to
     * declare. One filter over the whole set rather than a check per kind, since
     * the rule is the same for all of them.
     *
     * @param  list<FiscalDeadline>  $deadlines
     * @return list<FiscalDeadline>
     */
    private function sinceTheBusinessExisted(array $deadlines, ?CarbonInterface $startedOn): array
    {
        if (! $startedOn instanceof CarbonInterface) {
            return $deadlines;
        }

        $started = $startedOn->toDateString();

        return array_values(array_filter(
            $deadlines,
            static fn (FiscalDeadline $deadline): bool => $deadline->periodEnd->toDateString() >= $started,
        ));
    }

    /**
     * Declared and télépayé in one move, by the end of the month that follows
     * the period — the last day of that month whether it is 28, 30 or 31.
     *
     * @return list<FiscalDeadline>
     */
    private function urssaf(UserSettings $settings, CarbonImmutable $from, CarbonImmutable $to): array
    {
        $quarterly = $settings->urssaf_periodicity === UrssafPeriodicity::Quarterly;
        $scanFrom = $from->subMonths(self::LOOKBACK_MONTHS);
        $starts = $quarterly ? $this->quarterStarts($scanFrom, $to) : $this->monthStarts($scanFrom, $to);

        $deadlines = [];

        foreach ($starts as $start) {
            $periodEnd = $quarterly ? $start->addMonths(3)->subDay() : $start->endOfMonth();

            $deadlines[] = new FiscalDeadline(
                kind: FiscalDeadlineKind::UrssafDeclaration,
                periodKey: $quarterly ? $this->quarterKey($start) : $this->monthKey($start),
                period: $quarterly ? DeadlinePeriod::Quarter : DeadlinePeriod::Month,
                periodStart: $start,
                periodEnd: $periodEnd,
                dueOn: $this->roll($settings, $periodEnd->addDay()->endOfMonth()),
            );
        }

        return $this->within($deadlines, $from, $to);
    }

    /**
     * @return list<FiscalDeadline>
     */
    private function vat(UserSettings $settings, CarbonImmutable $from, CarbonImmutable $to): array
    {
        return match ($settings->vat_regime) {
            VatRegime::ReelNormal => $this->vatCa3($settings, $from, $to),
            VatRegime::ReelSimplifie => $this->vatCa12($settings, $from, $to),
            VatRegime::FranchiseEnBase => [],
        };
    }

    /**
     * @return list<FiscalDeadline>
     */
    private function vatCa3(UserSettings $settings, CarbonImmutable $from, CarbonImmutable $to): array
    {
        $deadlines = [];

        foreach ($this->monthStarts($from->subMonths(self::LOOKBACK_MONTHS), $to) as $start) {
            $deadlines[] = new FiscalDeadline(
                kind: FiscalDeadlineKind::VatCa3,
                periodKey: $this->monthKey($start),
                period: DeadlinePeriod::Month,
                periodStart: $start,
                periodEnd: $start->endOfMonth(),
                dueOn: $this->roll($settings, $start->addMonth()->setDay(self::CA3_DAY)),
            );
        }

        return $this->within($deadlines, $from, $to);
    }

    /**
     * « Le 2e jour ouvré suivant le 1er mai » of the following year. The 1er mai
     * itself is a jour férié, so the count always starts the day after.
     *
     * The régime's two semi-annual acomptes are not modelled: their dates come
     * from the taxpayer's own échéancier, not from a published rule.
     *
     * @return list<FiscalDeadline>
     */
    private function vatCa12(UserSettings $settings, CarbonImmutable $from, CarbonImmutable $to): array
    {
        $deadlines = [];

        foreach (range($from->year - 2, $to->year) as $year) {
            $firstWorkingDay = $this->roll($settings, $this->date($year + 1, 5, 1)->addDay());

            $deadlines[] = new FiscalDeadline(
                kind: FiscalDeadlineKind::VatCa12,
                periodKey: (string) $year,
                period: DeadlinePeriod::Year,
                periodStart: $this->date($year, 1, 1),
                periodEnd: $this->date($year, 12, 31),
                dueOn: $this->roll($settings, $firstWorkingDay->addDay()),
            );
        }

        return $this->within($deadlines, $from, $to);
    }

    /**
     * The December date is statutory, so the deadline is always on the calendar
     * — CFE is the bill everyone forgets, and hiding it until an amount is
     * known would be hiding it exactly from the people who forgot. Only the
     * June acompte needs the amount: it exists above 3 000 € — CfeSchedule's
     * call — and without a figure there is no threshold to cross.
     *
     * @return list<FiscalDeadline>
     */
    private function cfe(
        UserSettings $settings,
        CarbonImmutable $from,
        CarbonImmutable $to,
        ?Money $expectedCfe,
    ): array {
        $deadlines = [];

        foreach (range($from->year - 1, $to->year) as $year) {
            if (CfeSchedule::isExemptYear($settings, $year)) {
                continue;
            }

            $yearStart = $this->date($year, 1, 1);
            $yearEnd = $this->date($year, 12, 31);

            if ($expectedCfe instanceof Money && CfeSchedule::isSplit($expectedCfe)) {
                $deadlines[] = new FiscalDeadline(
                    kind: FiscalDeadlineKind::CfeInstalment,
                    periodKey: (string) $year,
                    period: DeadlinePeriod::Year,
                    periodStart: $yearStart,
                    periodEnd: $yearEnd,
                    dueOn: $this->roll($settings, $this->date($year, 6, self::CFE_INSTALMENT_DAY)),
                );
            }

            $deadlines[] = new FiscalDeadline(
                kind: FiscalDeadlineKind::Cfe,
                periodKey: (string) $year,
                period: DeadlinePeriod::Year,
                periodStart: $yearStart,
                periodEnd: $yearEnd,
                dueOn: $this->roll($settings, $this->date($year, 12, self::CFE_DAY)),
            );
        }

        return $this->within($deadlines, $from, $to);
    }

    /**
     * A due date landing on a weekend or a jour férié moves to the next working
     * day, the roll-forward every French administration applies.
     */
    private function roll(UserSettings $settings, CarbonImmutable $date): CarbonImmutable
    {
        return Holidays::nextBusinessDay($settings->business_country, $date->startOfDay());
    }

    /**
     * @return list<CarbonImmutable>
     */
    private function monthStarts(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $starts = [];

        for ($month = $from->startOfMonth(); $month->lessThanOrEqualTo($to); $month = $month->addMonth()) {
            $starts[] = $month;
        }

        return $starts;
    }

    /**
     * @return list<CarbonImmutable>
     */
    private function quarterStarts(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $starts = [];

        for ($quarter = $from->firstOfQuarter(); $quarter->lessThanOrEqualTo($to); $quarter = $quarter->addMonths(3)) {
            $starts[] = $quarter;
        }

        return $starts;
    }

    /**
     * @param  list<FiscalDeadline>  $deadlines
     * @return list<FiscalDeadline>
     */
    private function within(array $deadlines, CarbonImmutable $from, CarbonImmutable $to): array
    {
        $fromDate = $from->toDateString();
        $toDate = $to->toDateString();

        return array_values(array_filter(
            $deadlines,
            static fn (FiscalDeadline $deadline): bool => $deadline->dueOn->toDateString() >= $fromDate
                && $deadline->dueOn->toDateString() <= $toDate,
        ));
    }

    private function monthKey(CarbonImmutable $start): string
    {
        return $start->format('Y-m');
    }

    private function quarterKey(CarbonImmutable $start): string
    {
        return sprintf('%d-Q%d', $start->year, $start->quarter);
    }

    private function date(int $year, int $month, int $day): CarbonImmutable
    {
        return CarbonImmutable::parse(sprintf('%04d-%02d-%02d', $year, $month, $day));
    }
}
