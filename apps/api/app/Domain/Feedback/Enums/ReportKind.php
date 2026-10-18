<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Enums;

enum ReportKind: int
{
    case Bug = 0;
    case Feature = 1;

    /** The GitHub issue type the report is filed as. */
    public function issueType(): string
    {
        return match ($this) {
            self::Bug => 'Bug',
            self::Feature => 'Feature',
        };
    }
}
