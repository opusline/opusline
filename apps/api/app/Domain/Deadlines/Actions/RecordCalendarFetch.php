<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;

/**
 * The heartbeat behind « dernière synchronisation »: the app cannot observe a
 * calendar subscription, only the fetches it causes, so a feed read stamps the
 * settings row.
 *
 * An instant rather than the account's calendar date — the screen shows how long
 * ago the calendar app last called, which is a duration, not a fiscal date. And
 * a coarse one: the stamp is throttled, and written without touching
 * updated_at, because the feed's ETag reads settings.updated_at — a heartbeat
 * that invalidated the very response it stamps would turn every second poll
 * into a full rebuild.
 */
class RecordCalendarFetch
{
    private const int THROTTLE_MINUTES = 15;

    public function handle(User $user): void
    {
        $settings = $user->settingsOrFail();
        $lastSyncedAt = $settings->calendar_last_synced_at;

        if ($lastSyncedAt !== null && $lastSyncedAt->greaterThan(now()->subMinutes(self::THROTTLE_MINUTES))) {
            return;
        }

        UserSettings::withoutTimestamps(
            static fn () => $settings->update(['calendar_last_synced_at' => now()]),
        );
    }
}
