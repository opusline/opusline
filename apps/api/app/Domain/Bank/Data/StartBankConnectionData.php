<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Bank\Enums\BankPsuType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

class StartBankConnectionData extends Data
{
    public function __construct(
        /** A bank's name exactly as GET /bank/aspsps lists it. */
        #[Max(255)]
        public string $aspspName,
        public BankPsuType $psuType,
    ) {}
}
