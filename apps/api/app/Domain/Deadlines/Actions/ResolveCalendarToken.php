<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Calendar\CalendarToken;
use App\Domain\Settings\Models\UserSettings;
use RuntimeException;

/**
 * The account's feed token, minted on first use rather than backfilled onto
 * every account: most will never subscribe a calendar.
 *
 * That first mint happens on a GET the sidebar fires from every screen, so it
 * is written conditionally and read back rather than assigned: two requests
 * racing the first read must come away with the same token, or whichever URL
 * the user subscribes to would 404 the moment the other one won.
 */
class ResolveCalendarToken
{
    public function handle(UserSettings $settings): string
    {
        if ($settings->calendar_token !== null) {
            return $settings->calendar_token;
        }

        UserSettings::query()
            ->whereKey($settings->getKey())
            ->whereNull('calendar_token')
            ->update(['calendar_token' => CalendarToken::mint()]);

        $settings->refresh();

        return $settings->calendar_token
            ?? throw new RuntimeException(
                sprintf('No calendar token for user settings %d.', $settings->id),
            );
    }
}
