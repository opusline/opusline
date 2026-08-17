<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

class ClientRevenueDetailData extends Data
{
    public function __construct(
        /** The civil year the year-to-date figures cover, for the tile label. */
        public int $year,
        public ClientRevenueData $revenue,
    ) {}
}
