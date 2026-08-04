<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class ClientListData extends Data
{
    /**
     * @param  list<ClientWithMissionsData>  $clients
     */
    public function __construct(
        #[DataCollectionOf(ClientWithMissionsData::class)]
        public array $clients,
    ) {}
}
