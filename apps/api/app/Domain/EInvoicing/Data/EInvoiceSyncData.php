<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Data;

use Spatie\LaravelData\Data;

/** What one read of the inbox did. */
class EInvoiceSyncData extends Data
{
    public function __construct(
        /** Received invoices the platform listed. */
        public int $fetched,
        /** Expenses created, with their PDF as receipt. */
        public int $imported,
        /** Expenses already there whose lifecycle status moved. */
        public int $updated,
        /** Invoices left aside: not in the account currency, or without the structured part. */
        public int $skipped,
    ) {}
}
