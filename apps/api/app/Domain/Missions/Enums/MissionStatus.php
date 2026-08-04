<?php

declare(strict_types=1);

namespace App\Domain\Missions\Enums;

enum MissionStatus: int
{
    case Active = 0;
    case Paused = 1;
    case Done = 2;
}
