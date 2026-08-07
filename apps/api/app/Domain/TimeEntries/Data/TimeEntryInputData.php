<?php

declare(strict_types=1);

namespace App\Domain\TimeEntries\Data;

use App\Domain\Shared\Validation\AuthenticatedUserId;
use App\Domain\TimeEntries\Models\TimeEntry;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\Constraints\WhereConstraint;

class TimeEntryInputData extends Data
{
    public function __construct(
        #[IntegerType]
        #[Exists('missions', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public int $missionId,
        #[DateFormat('Y-m-d')]
        public string $date,
        #[IntegerType, Between(1, TimeEntry::MINUTES_PER_DAY)]
        public int $durationMinutes,
        #[Max(2000)]
        public ?string $note = null,
    ) {}
}
