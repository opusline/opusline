<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Documents;

use Carbon\CarbonImmutable;

/** A payment term as an invoice states it: so many days, counted from the issue date or from the end of its month. */
final readonly class PaymentTerm
{
    public function __construct(
        public int $days,
        public bool $endOfMonth,
    ) {}

    public function dueOn(CarbonImmutable $issuedOn): CarbonImmutable
    {
        $start = $this->endOfMonth ? $issuedOn->endOfMonth()->startOfDay() : $issuedOn;

        return $start->addDays($this->days);
    }
}
