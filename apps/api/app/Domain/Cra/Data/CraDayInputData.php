<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use App\Domain\Cra\Models\CraDay;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Data;

class CraDayInputData extends Data
{
    public function __construct(
        #[DateFormat('Y-m-d')]
        public string $date,
        /** A day is never more than a day: the client is billed days, not overtime. */
        #[IntegerType, Between(1, CraDay::FULL_DAY_BP)]
        public int $dayFractionBp,
    ) {}
}
