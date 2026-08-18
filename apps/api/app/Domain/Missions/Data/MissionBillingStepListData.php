<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class MissionBillingStepListData extends Data
{
    /**
     * @param  list<MissionBillingStepData>  $steps
     */
    public function __construct(
        #[DataCollectionOf(MissionBillingStepData::class)]
        public array $steps,
        /**
         * What the steps add up to. Reported rather than enforced: a schedule that
         * does not match the price is a discrepancy to look at, not a write to
         * refuse — the contract is what it is, and an avenant is normal.
         */
        public MoneyData $scheduled,
    ) {}
}
