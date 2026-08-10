<?php

declare(strict_types=1);

namespace App\Domain\Timers\Data;

use Spatie\LaravelData\Data;

class TimerStateData extends Data
{
    public function __construct(
        public ?TimerData $timer,
        public ?int $lastMissionId,
    ) {}
}
