<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Settings\Models\UserSettings;

/**
 * Clears the reminder badge.
 *
 * The watermark is the account's own calendar date, not the wall clock: leads
 * trigger at midnight of the account's timezone, so storing that same instant
 * marks every reminder up to and including today read — and does so identically
 * for a user reading at 08:00 in Paris and one reading at 08:00 in Auckland.
 */
class MarkDeadlineRemindersRead
{
    public function handle(UserSettings $settings): void
    {
        $settings->deadline_reminders_read_at = $settings->today();
        $settings->save();
    }
}
