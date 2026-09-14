<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Enums\ContributionLineKind;
use App\Domain\Shared\Fiscality\ContributionLine;
use Spatie\LaravelData\Data;

/** One line of the URSSAF settlement: a rate on the declared base and what it comes to. */
class ContributionLineData extends Data
{
    public function __construct(
        public ContributionLineKind $kind,
        public int $rateBp,
        public MoneyData $amount,
    ) {}

    public static function fromLine(ContributionLine $line): self
    {
        return new self(kind: $line->kind, rateBp: $line->rateBp, amount: MoneyData::fromMoney($line->amount));
    }
}
