<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class DeclarationListData extends Data
{
    /**
     * @param  list<DeclarationData>  $declarations  Soonest due first.
     */
    public function __construct(
        #[DataCollectionOf(DeclarationData::class)]
        public array $declarations,
        /** See FiscalDeadlineListData: the annual CA12 is not computed. */
        public bool $hasUncomputedVatSchedule,
    ) {}
}
