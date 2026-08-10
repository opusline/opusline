<?php

declare(strict_types=1);

namespace App\Domain\Timers\Enums;

enum TimerState: int
{
    case Running = 0;
    case Paused = 1;
}
