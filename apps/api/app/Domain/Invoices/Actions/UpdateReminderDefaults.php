<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\ReminderDefaultsData;
use App\Domain\Invoices\Data\UpdateReminderDefaultsData;
use App\Domain\Settings\Models\UserSettings;

class UpdateReminderDefaults
{
    public function handle(UserSettings $settings, UpdateReminderDefaultsData $data): ReminderDefaultsData
    {
        $settings->update([
            'reminders_default_enabled' => $data->enabled,
            'reminders_default_frequency' => $data->frequency,
        ]);

        return ReminderDefaultsData::fromSettings($settings);
    }
}
