<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Calendar;

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
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
}
