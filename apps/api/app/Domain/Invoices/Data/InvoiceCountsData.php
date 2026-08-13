<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

/**
 * The filter chip counts. `late` overlaps `sent` on purpose — it is a derived view
 * of the same rows, not a fourth status.
 */
class InvoiceCountsData extends Data
{
    public function __construct(
        public int $all,
        public int $draft,
        public int $sent,
        public int $late,
        public int $paid,
    ) {}
}
