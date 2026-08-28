<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Data;

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class CompleteFiscalDeadlineData extends Data
{
    /**
     * A civil year, one of its months, or one of its quarters. Undelimited so
     * the DELETE route can constrain its {periodKey} on the same expression —
     * two dialects of "a valid period key" would drift apart.
     */
    public const string PERIOD_KEY_EXPRESSION = '\d{4}(-(0[1-9]|1[0-2]|Q[1-4]))?';

    public const string PERIOD_KEY_PATTERN = '/^'.self::PERIOD_KEY_EXPRESSION.'$/';

    public function __construct(
        #[Enum(FiscalDeadlineKind::class)]
        public FiscalDeadlineKind $kind,
        #[StringType, Max(16), Regex(self::PERIOD_KEY_PATTERN)]
        public string $periodKey,
    ) {}
}
