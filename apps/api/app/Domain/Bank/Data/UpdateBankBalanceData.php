<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Data\SignedMoneyData;
use Spatie\LaravelData\Data;

class UpdateBankBalanceData extends Data
{
    public function __construct(
        /** Null clears the hand-typed anchor and falls back to statement balances. */
        public ?SignedMoneyData $balance = null,
    ) {}
}
