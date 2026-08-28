<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Calendar\CalendarToken;
use App\Domain\Settings\Models\UserSettings;

/**
 * Mints a fresh feed token, retiring the previous one. The URL is a bearer
 * credential — anyone holding it reads the account's deadlines and amounts —
 * so rotating it is the one way to revoke a calendar already subscribed to.
 */
class RegenerateCalendarToken
{
    public function handle(UserSettings $settings): string
    {
        $settings->calendar_token = CalendarToken::mint();
        $settings->save();

        return $settings->calendar_token;
    }
}
