<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

class LinkExpenseBankMovementData extends Data
{
    public function __construct(
        #[IntegerType, Min(1)]
        public int $bankMovementId,
    ) {}
}
