<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Deadlines\Data\CompleteFiscalDeadlineData;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Shared\Calendar\CivilMonth;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

/**
 * A tick from the Déclarations screen: which return, over which period —
 * and which month the screen is on, so the answer is the screen it came
 * from rather than the month the period happens to end in.
 */
class CompleteDeclarationData extends Data
{
    public function __construct(
        #[Enum(FiscalDeadlineKind::class)]
        public FiscalDeadlineKind $kind,
        #[StringType, Max(16), Regex(CompleteFiscalDeadlineData::PERIOD_KEY_PATTERN)]
        public string $periodKey,
        #[StringType, Regex(CivilMonth::EXPRESSION)]
        public ?string $period = null,
    ) {}
}
