<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Data;

use Spatie\LaravelData\Data;

/**
 * One line of the in-app reminder feed: a deadline close enough to be worth
 * saying out loud.
 *
 * How long is left is not on the wire — the client derives it from the due date
 * against the account's own today, the way it derives every other lateness in
 * the app. Whether it has been read is the opposite: only the server knows the
 * watermark.
 */
class DeadlineReminderData extends Data
{
    public function __construct(
        public FiscalDeadlineData $deadline,
        /** False once the reminder has crossed a new lead time since the user last looked. */
        public bool $isRead,
    ) {}
}
