<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Enums;

use Carbon\CarbonImmutable;

enum SubscriptionPeriodicity: int
{
    case Monthly = 0;
    case Quarterly = 1;
    case Annual = 2;

    public function months(): int
    {
        return match ($this) {
            self::Monthly => 1,
            self::Quarterly => 3,
            self::Annual => 12,
        };
    }

    public function occurrencesPerYear(): int
    {
        return intdiv(12, $this->months());
    }

    /** `2026-07`, `2026-Q3` or `2026`: the key an occurrence and the expense it becomes share. */
    public function periodKey(CarbonImmutable $debitOn): string
    {
        return match ($this) {
            self::Monthly => $debitOn->format('Y-m'),
            self::Quarterly => sprintf('%d-Q%d', $debitOn->year, $debitOn->quarter),
            self::Annual => (string) $debitOn->year,
        };
    }
}
