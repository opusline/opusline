<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

class BankProvisionData extends Data
{
    public function __construct(
        public MoneyData $amount,
        /** Null for TVA, which sums each invoice's actual rate instead of applying one. */
        public ?int $rateBp,
    ) {}
}
