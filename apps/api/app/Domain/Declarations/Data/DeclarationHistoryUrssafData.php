<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

class DeclarationHistoryUrssafData extends Data
{
    public function __construct(
        /** The period the month was declared in — its own key, or the quarter's. */
        public string $period,
        public MoneyData $total,
        public ?DeclarationCompletionData $completion,
    ) {}
}
