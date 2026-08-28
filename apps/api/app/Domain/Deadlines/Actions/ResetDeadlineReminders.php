<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Settings\Models\UserSettings;

/**
 * Puts the reminder badge back. Called when a settings save rewrites the fiscal
 * calendar: an occurrence the change surfaces may already be past its first
 * lead, and would otherwise sit behind the watermark forever with no badge.
 *
 * Named rather than inlined so both writers of the watermark — this and
 * MarkDeadlineRemindersRead — are findable from the domain that owns it.
 */
class ResetDeadlineReminders
{
    public function handle(UserSettings $settings): void
    {
        $settings->deadline_reminders_read_at = null;
        $settings->save();
    }
}
