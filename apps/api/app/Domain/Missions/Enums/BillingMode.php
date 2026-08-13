<?php

declare(strict_types=1);

namespace App\Domain\Missions\Enums;

enum BillingMode: int
{
    case Daily = 0;
    case Hourly = 1;
    case Fixed = 2;

    public function usesDayFraction(): bool
    {
        return $this !== self::Hourly;
    }

    public function resolveRounding(?EntryRounding $requested): ?EntryRounding
    {
        if ($this === self::Fixed) {
            return null;
        }

        return $requested ?? EntryRounding::Half;
    }

    /**
     * Whether the mission owes a monthly CRA, given what the caller asked for and what
     * the client's type implies. An hourly mission never does: a CRA reports days, and
     * the ESN default must not quietly put one on a mission that has none to report.
     */
    public function resolveCraRequired(?bool $requested, bool $clientDefault): bool
    {
        if (! $this->usesDayFraction()) {
            return false;
        }

        return $requested ?? $clientDefault;
    }
}
