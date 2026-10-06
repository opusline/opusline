<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Data\UpdateNotificationPreferencesData;
use App\Domain\Settings\Models\UserSettings;

class UpdateNotificationPreferences
{
    public function handle(UserSettings $settings, UpdateNotificationPreferencesData $data): void
    {
        $settings->update([
            'mail_security_alerts' => $data->securityAlerts,
            'mail_deadline_reminders' => $data->deadlineReminders,
        ]);
    }
}
