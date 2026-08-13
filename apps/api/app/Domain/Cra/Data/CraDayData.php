<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * One calendar day of the month. Every day is sent, worked or not, so the grid and the
 * PDF can be drawn without the client owning a French holiday table of its own.
 */
class CraDayData extends Data
{
    public function __construct(
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $date,
        /** Reported fraction of a workday, in basis points. 0 when not worked. */
        public int $dayFractionBp,
        /** What tracked time says for that day — what "Rétablir mes entrées" restores. */
        public int $trackedDayFractionBp,
        public bool $isWeekend,
        public bool $isHoliday,
        public ?string $holidayName,
    ) {}
}
