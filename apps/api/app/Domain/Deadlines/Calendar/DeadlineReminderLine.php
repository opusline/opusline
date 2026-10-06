<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Calendar;

use Carbon\CarbonImmutable;

/**
 * One deadline the reminder email names. Its title and amount are already
 * worded in the account's language: the mail is written later by a queue
 * worker, and what it says about a deadline must be what was true when the
 * reminder was decided. The notification only adds when it falls due.
 */
final readonly class DeadlineReminderLine
{
    public function __construct(
        public string $title,
        public ?string $amount,
        public CarbonImmutable $dueOn,
        /** Which of DeadlineReminders::LEAD_DAYS the deadline reached today. */
        public int $leadDays,
    ) {}
}
