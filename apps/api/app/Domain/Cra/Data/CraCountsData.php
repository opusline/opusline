<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use Spatie\LaravelData\Data;

class CraCountsData extends Data
{
    public function __construct(
        /** Months still owed to a client — the "à produire" counter. */
        public int $toProduce,
        public int $sent,
        public int $signed,
    ) {}
}
