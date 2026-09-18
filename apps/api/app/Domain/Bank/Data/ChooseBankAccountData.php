<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

class ChooseBankAccountData extends Data
{
    public function __construct(
        #[Max(64)]
        public string $accountUid,
    ) {}
}
