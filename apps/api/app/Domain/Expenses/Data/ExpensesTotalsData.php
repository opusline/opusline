<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

class ExpensesTotalsData extends Data
{
    public function __construct(
        public MoneyData $ht,
        public MoneyData $ttc,
        public int $count,
    ) {}
}
