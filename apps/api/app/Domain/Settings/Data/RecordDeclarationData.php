<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use App\Domain\Settings\Enums\FiscalDeadlineKind;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class RecordDeclarationData extends Data
{
    public function __construct(
        #[Enum(FiscalDeadlineKind::class)]
        public FiscalDeadlineKind $kind,
        /** `Y-m` for a month or `Y-Qn` for a quarter, as the deadlines emit. */
        #[Regex('/^\d{4}-(0[1-9]|1[0-2]|Q[1-4])$/')]
        public string $period,
        /** A return is recorded after filing, so it can never be in the future. */
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public ?string $filedOn = null,
        public ?MoneyData $declaredAmount = null,
    ) {}
}
