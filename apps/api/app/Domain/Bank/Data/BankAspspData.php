<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Bank\EnableBanking\Aspsp;
use App\Domain\Bank\Enums\BankPsuType;
use Spatie\LaravelData\Data;

class BankAspspData extends Data
{
    /**
     * @param  list<BankPsuType>  $psuTypes
     */
    public function __construct(
        public string $name,
        public array $psuTypes,
        /** Enable Banking still calls its connector to this bank a beta. */
        public bool $isBeta,
    ) {}

    public static function fromAspsp(Aspsp $aspsp): self
    {
        return new self(name: $aspsp->name, psuTypes: $aspsp->psuTypes, isBeta: $aspsp->isBeta);
    }
}
