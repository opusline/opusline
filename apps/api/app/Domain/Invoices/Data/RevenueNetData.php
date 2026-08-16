<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * The net estimate after URSSAF contributions. Absent from the response for
 * accounts without French fiscality, where the rate means nothing.
 */
class RevenueNetData extends Data
{
    public function __construct(
        public MoneyData $amount,
        public MoneyData $contributions,
        public int $rateBp,
    ) {}
}
