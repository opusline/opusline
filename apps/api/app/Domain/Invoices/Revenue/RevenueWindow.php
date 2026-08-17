<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Revenue;

use Carbon\CarbonImmutable;

/**
 * The account settings every figure of one revenue response is cut against —
 * the civil year and month, the currency amounts are summed in, and the workday
 * tracked time is valued against. Resolved once per request so no two figures
 * of a response can disagree about when "this month" ended.
 */
final readonly class RevenueWindow
{
    private function __construct(
        public int $year,
        public CarbonImmutable $yearStart,
        public CarbonImmutable $yearEnd,
        public CarbonImmutable $monthStart,
        public CarbonImmutable $monthEnd,
        public string $currency,
        public int $workdayMinutes,
    ) {}

    public static function around(CarbonImmutable $today, string $currency, int $workdayMinutes): self
    {
        return new self(
            year: $today->year,
            yearStart: $today->startOfYear(),
            yearEnd: $today->endOfYear(),
            monthStart: $today->startOfMonth(),
            monthEnd: $today->endOfMonth(),
            currency: $currency,
            workdayMinutes: $workdayMinutes,
        );
    }

    /**
     * Whole months from one date's month to another's, counting both ends and
     * falling back to this window's month.
     *
     * Carbon 3 diffs are signed, so a date ahead of the end would otherwise
     * yield zero or a negative span — the floor keeps a forward-dated invoice
     * on the single month it sits in.
     */
    public function monthsBetween(CarbonImmutable $from, ?CarbonImmutable $until): int
    {
        $end = ($until ?? $this->monthStart)->startOfMonth();

        return max(1, (int) $from->startOfMonth()->diffInMonths($end) + 1);
    }
}
