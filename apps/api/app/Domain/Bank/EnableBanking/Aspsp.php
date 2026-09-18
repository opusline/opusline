<?php

declare(strict_types=1);

namespace App\Domain\Bank\EnableBanking;

use App\Domain\Bank\Enums\BankPsuType;

/** A bank Enable Banking can reach (« ASPSP » in PSD2 terms). */
final readonly class Aspsp
{
    /**
     * @param  list<BankPsuType>  $psuTypes
     */
    public function __construct(
        public string $name,
        public string $country,
        public array $psuTypes,
        public int $maximumConsentSeconds,
        /** Enable Banking's own flag: its connector to this bank is still in beta. */
        public bool $isBeta,
    ) {}

    public function supports(BankPsuType $psuType): bool
    {
        return in_array($psuType, $this->psuTypes, strict: true);
    }
}
