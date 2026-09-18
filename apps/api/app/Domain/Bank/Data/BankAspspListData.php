<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class BankAspspListData extends Data
{
    /**
     * @param  list<BankAspspData>  $aspsps
     */
    public function __construct(
        /** The banks of the account's business country, as Enable Banking names them. */
        #[DataCollectionOf(BankAspspData::class)]
        public array $aspsps,
    ) {}
}
