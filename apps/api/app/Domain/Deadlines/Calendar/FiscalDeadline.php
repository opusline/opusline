<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Calendar;

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Settings\Enums\Locale;
use Carbon\CarbonImmutable;

/**
 * One occurrence of a recurring fiscal deadline: which obligation, over which
 * period, due when. Amounts live outside — this is the calendar alone, so it
 * stays identical between two accounts sharing a fiscal profile.
 */
final readonly class FiscalDeadline
{
    public function __construct(
        public FiscalDeadlineKind $kind,
        /**
         * The occurrence's durable handle — `2026-07`, `2026-Q3` or `2026`.
         * Completions are stored against it rather than against a date, so
         * moving the CA3 day does not resurrect a deadline already ticked off.
         */
        public string $periodKey,
        public DeadlinePeriod $period,
        /** The window the obligation covers; the progress bar fills across it. */
        public CarbonImmutable $periodStart,
        public CarbonImmutable $periodEnd,
        public CarbonImmutable $dueOn,
    ) {}

    /** Identity across a request: kind plus period, matching the completions' unique key. */
    public function key(): string
    {
        return "{$this->kind->value}:{$this->periodKey}";
    }

    /** « Déclaration URSSAF — juillet 2026 »: the occurrence as the calendar feed and the reminder email name it. */
    public function title(Locale $locale): string
    {
        return __('deadlines.event_title', [
            'obligation' => __("deadlines.kind.{$this->kind->name}", [], $locale->languageTag()),
            'period' => $this->periodLabel($locale),
        ], $locale->languageTag());
    }

    private function periodLabel(Locale $locale): string
    {
        return match ($this->period) {
            DeadlinePeriod::Year => $this->periodKey,
            DeadlinePeriod::Quarter => __('deadlines.period_quarter', [
                'quarter' => $this->periodStart->quarter,
                'year' => $this->periodStart->year,
            ], $locale->languageTag()),
            // settings() returns a Carbon, where locale() is a getter/setter union.
            DeadlinePeriod::Month => $this->periodStart
                ->settings(['locale' => $locale->languageTag()])
                ->translatedFormat('F Y'),
        };
    }

    public function is(FiscalDeadlineKind $kind, string $periodKey): bool
    {
        return $this->kind === $kind && $this->periodKey === $periodKey;
    }

    /**
     * @param  list<self>  $deadlines
     */
    public static function find(array $deadlines, FiscalDeadlineKind $kind, string $periodKey): ?self
    {
        foreach ($deadlines as $deadline) {
            if ($deadline->is($kind, $periodKey)) {
                return $deadline;
            }
        }

        return null;
    }

    /** `2026-07` — the key a monthly occurrence and a monthly completion share. */
    public static function monthKey(CarbonImmutable $start): string
    {
        return $start->format('Y-m');
    }

    /** `2026-Q3` — the key a quarterly occurrence and a quarterly completion share. */
    public static function quarterKey(CarbonImmutable $start): string
    {
        return sprintf('%d-Q%d', $start->year, $start->quarter);
    }
}
