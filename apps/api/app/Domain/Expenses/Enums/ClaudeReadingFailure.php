<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Enums;

/** Why Claude did not read a receipt the account asked it to, so the heuristics did. */
enum ClaudeReadingFailure: int
{
    /** Anthropic refused the key: the account has to replace it. */
    case KeyRejected = 0;

    /** Anthropic was unreachable, busy or rate-limiting: trying again later may work. */
    case Unavailable = 1;

    /** Claude answered without a usable reading: a file it cannot open, or it declined. */
    case Unreadable = 2;
}
