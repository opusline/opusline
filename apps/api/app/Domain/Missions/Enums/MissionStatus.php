<?php

declare(strict_types=1);

namespace App\Domain\Missions\Enums;

enum MissionStatus: string
{
    case Active = 'active';
    case Paused = 'paused';
    case Done = 'done';
}
