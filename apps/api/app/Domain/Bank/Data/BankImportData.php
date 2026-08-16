<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use Spatie\LaravelData\Data;

class BankImportData extends Data
{
    public function __construct(
        /** Movements the file contained. */
        public int $lineCount,
        /** How many were new — overlapping re-imports skip what is already there. */
        public int $importedCount,
        /** Reconciliation suggestions raised by the new movements. */
        public int $suggestionCount,
        public BankAccountData $account,
    ) {}
}
