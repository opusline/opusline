<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Enums;

use Anthropic\Messages\MessageParam\Role;

/** Who said a line of the conversation that drafts a report. */
enum ReportSpeaker: int
{
    case Account = 0;
    case Claude = 1;

    public function role(): Role
    {
        return match ($this) {
            self::Account => Role::USER,
            self::Claude => Role::ASSISTANT,
        };
    }
}
