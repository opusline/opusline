<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Users\Models\User;

/**
 * The heartbeat behind « dernière synchronisation »: the app cannot observe a
 * calendar subscription, only the fetches it causes, so every feed read stamps
 * the settings row.
 *
 * An instant rather than the account's calendar date — the screen shows how long
 * ago the calendar app last called, which is a duration, not a fiscal date.
 */
class RecordCalendarFetch
{
    public function handle(User $user): void
    {
        $user->settingsOrFail()->update(['calendar_last_synced_at' => now()]);
    }
}
