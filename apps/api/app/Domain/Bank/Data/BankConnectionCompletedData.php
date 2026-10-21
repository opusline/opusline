<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use Spatie\LaravelData\Data;

class BankConnectionCompletedData extends Data
{
    public function __construct(
        /** The connection the authorization created or renewed. */
        public int $connectionId,
        public BankAccountData $account,
    ) {}
}
