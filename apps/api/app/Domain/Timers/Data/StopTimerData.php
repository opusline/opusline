<?php

declare(strict_types=1);

namespace App\Domain\Timers\Data;

use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\TimeEntries\Models\TimeEntry;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Present;
use Spatie\LaravelData\Data;

class StopTimerData extends Data
{
    public function __construct(
        #[DateFormat('Y-m-d')]
        public string $date,
        #[IntegerType, Between(1, TimeEntry::MINUTES_PER_DAY)]
        public int $durationMinutes,
        #[Enum(EntryRounding::class)]
        public ?EntryRounding $rounding,
        #[Present, Max(2000)]
        public ?string $note,
        #[BooleanType]
        public bool $billable = true,
    ) {}
}
