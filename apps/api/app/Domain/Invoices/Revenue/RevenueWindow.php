<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Revenue;

use Carbon\CarbonImmutable;

/**
 * The civil year and month the revenue figures are cut against, plus the
 * currency they are summed in, resolved once per request from the account
 * settings so every figure of a response is cut against the same instant.
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
    ) {}

    public static function around(CarbonImmutable $today, string $currency): self
    {
        return new self(
            year: $today->year,
            yearStart: $today->startOfYear(),
            yearEnd: $today->endOfYear(),
            monthStart: $today->startOfMonth(),
            monthEnd: $today->endOfMonth(),
            currency: $currency,
        );
    }

    /**
     * Whole months from the given date's month to this window's, counting both
     * ends. Carbon 3 diffs are signed, so a date ahead of the window would
     * otherwise yield zero or a negative span — the floor keeps a forward-dated
     * invoice on the single month it sits in.
     */
    public function monthsSince(CarbonImmutable $from): int
    {
        return max(1, (int) $from->startOfMonth()->diffInMonths($this->monthStart) + 1);
    }
}
