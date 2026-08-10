<?php

declare(strict_types=1);

namespace App\Domain\Timers\Data;

use App\Domain\Shared\Enums\Color;
use App\Domain\Timers\Enums\TimerState;
use App\Domain\Timers\Models\RunningTimer;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

class TimerData extends Data
{
    public function __construct(
        public int $id,
        public int $missionId,
        public string $missionName,
        public Color $missionColor,
        public TimerState $state,
        public CarbonImmutable $startedAt,
        public int $elapsedSeconds,
        public ?string $note,
    ) {}

    public static function fromModel(RunningTimer $timer): self
    {
        $timer->loadMissing('mission.client');

        return new self(
            id: $timer->id,
            missionId: $timer->mission_id,
            missionName: $timer->mission->name,
            missionColor: $timer->mission->effectiveColor(),
            state: $timer->state(),
            startedAt: $timer->started_at,
            elapsedSeconds: $timer->elapsedSeconds(),
            note: $timer->note,
        );
    }
}
