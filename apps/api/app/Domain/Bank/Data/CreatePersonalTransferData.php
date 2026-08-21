<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class CreatePersonalTransferData extends Data
{
    public function __construct(
        public MoneyData $amount,
        /** The day the bank booked it; a transfer already made is never post-dated. */
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public string $transferredOn,
        #[StringType, Max(255)]
        public ?string $note = null,
    ) {}
}
