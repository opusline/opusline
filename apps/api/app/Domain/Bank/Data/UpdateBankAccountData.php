<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class UpdateBankAccountData extends Data
{
    public function __construct(
        /** Null shows the default « Compte pro » label. */
        #[StringType, Max(120)]
        public ?string $name,
        /** A closed account keeps its history and stops holding back the treasury's coverage. */
        #[Required, BooleanType]
        public bool $archived,
    ) {}
}
