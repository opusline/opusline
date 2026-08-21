<?php

declare(strict_types=1);

namespace App\Domain\Documents\Enums;

enum DocumentSource: int
{
    case Mission = 0;
    case Client = 1;
    case User = 2;
}
