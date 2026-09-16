<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * What is left of the period after URSSAF contributions. Absent from the
 * response for accounts without French fiscality, where the rate means nothing.
 */
class RevenueNetData extends Data
{
    public function __construct(
        public MoneyData $amount,
        public MoneyData $contributions,
        /**
         * The one rate every return of the period is settled at — caption context,
         * not the sum's input. Null once a rate change falls inside the period.
         */
        public ?int $rateBp,
        /**
         * True while the figure can still move: invoiced revenue is not what the
         * URSSAF taxes, a running return is not declared yet, and a return older
         * than the recorded rate history is priced at today's rate for want of
         * better. False on a closed period of collected revenue whose returns are
         * all settled at a known rate.
         */
        public bool $estimated,
    ) {}
}
