<?php

declare(strict_types=1);

namespace App\Domain\Shared\Fiscality;

use App\Domain\Shared\Enums\ContributionLineKind;
use Cknow\Money\Money;

final readonly class ContributionLine
{
    public function __construct(
        public ContributionLineKind $kind,
        public int $rateBp,
        public Money $amount,
    ) {}
}
