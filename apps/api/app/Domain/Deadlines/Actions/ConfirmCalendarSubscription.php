<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Settings\Models\UserSettings;

/**
 * The user's word that the address is now in their calendar app. The app
 * cannot see the subscription itself — only the fetches it causes — so this
 * claim is what flips the screen to the subscribed state, and the fetch
 * timestamps then corroborate it.
 */
class ConfirmCalendarSubscription
{
    public function handle(UserSettings $settings): void
    {
        $settings->update(['calendar_subscribed_on' => $settings->today()]);
    }
}
