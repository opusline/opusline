<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Actions;

use App\Domain\Deadlines\Data\UpdateCalendarFeedData;
use App\Domain\Settings\Models\UserSettings;

class UpdateCalendarFeed
{
    public function handle(UserSettings $settings, UpdateCalendarFeedData $data): void
    {
        $settings->update([
            'calendar_feed_invoices' => $data->invoices,
            'calendar_feed_reminders' => $data->reminders,
            'calendar_feed_vat' => $data->vat,
            'calendar_feed_urssaf' => $data->urssaf,
            'calendar_feed_other' => $data->other,
        ]);
    }
}
