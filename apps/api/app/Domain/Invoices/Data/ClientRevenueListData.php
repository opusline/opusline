<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class ClientRevenueListData extends Data
{
    /**
     * @param  list<ClientRevenueData>  $clients
     */
    public function __construct(
        /** The civil year the year-to-date figures cover, for the column header. */
        public int $year,
        #[DataCollectionOf(ClientRevenueData::class)]
        public array $clients,
    ) {}
}
