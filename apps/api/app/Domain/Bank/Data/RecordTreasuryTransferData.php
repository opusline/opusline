<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class RecordTreasuryTransferData extends Data
{
    public function __construct(
        public MoneyData $amount,
        /** A transfer is noted after the fact, so it can never be in the future. */
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public ?string $transferredOn = null,
        #[Max(255)]
        public ?string $note = null,
    ) {}
}
