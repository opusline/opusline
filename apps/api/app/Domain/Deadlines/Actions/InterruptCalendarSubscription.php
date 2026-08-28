<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Settings\Models\UserSettings;

/**
 * Stops the publication for real, not just on screen: the token is retired, so
 * every calendar holding the old address stops receiving on its next poll.
 * The subscription marks are cleared with it — a later re-subscribe starts a
 * fresh story at a fresh address.
 */
class InterruptCalendarSubscription
{
    public function __construct(private readonly RegenerateCalendarToken $regenerateCalendarToken) {}

    public function handle(UserSettings $settings): void
    {
        $settings->update([
            'calendar_subscribed_on' => null,
            'calendar_last_synced_at' => null,
        ]);

        $this->regenerateCalendarToken->handle($settings);
    }
}
