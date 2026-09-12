<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use Spatie\LaravelData\Data;

/** The « Annuel » card: the year the shown month belongs to. */
class AnnualDeclarationsData extends Data
{
    public function __construct(
        public IncomeTaxReturnData $incomeTaxReturn,
        /** Null in the year the business started, which the CFE exempts. */
        public ?CfeReturnData $cfe,
    ) {}
}
