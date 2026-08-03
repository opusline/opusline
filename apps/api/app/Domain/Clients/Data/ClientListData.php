<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class ClientListData extends Data
{
    /**
     * @param  list<ClientData>  $clients
     */
    public function __construct(
        #[DataCollectionOf(ClientData::class)]
        public array $clients,
    ) {}
}
