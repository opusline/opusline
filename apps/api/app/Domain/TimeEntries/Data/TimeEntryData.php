<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Data;

use App\Domain\TimeEntries\Models\TimeEntry;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class TimeEntryData extends Data
{
    public function __construct(
        public int $id,
        public int $missionId,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $date,
        public int $durationMinutes,
        public ?int $valuedMinutes,
        public ?float $valuedDayFraction,
        public ?string $note,
    ) {}

    public static function fromModel(TimeEntry $timeEntry): self
    {
        return new self(
            id: $timeEntry->id,
            missionId: $timeEntry->mission_id,
            date: $timeEntry->date,
            durationMinutes: $timeEntry->duration_minutes,
            valuedMinutes: $timeEntry->valuedMinutes(),
            valuedDayFraction: $timeEntry->valuedDayFraction(),
            note: $timeEntry->note,
        );
    }
}
